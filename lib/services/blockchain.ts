import {ethers} from "ethers";
import {IMedicalRecord, IPatientData, IPhysicianData} from "@/lib/types";
import {networkConfig} from "@/networks.config";


export class Blockchain {
    contract: ethers.Contract;
    currentUserRole?: number | undefined;
    selectedChainId: string;
    getWalletBalance: any;

    USER_PATIENT = 1;
    USER_PHYSICIAN = 2;

    constructor(contract: ethers.Contract, selectedChainId: string, getWalletBalance: any) {
        this.contract = contract;
        this.selectedChainId = selectedChainId;
        this.getWalletBalance = getWalletBalance;
        this.initEventListeners();
    }

    async addPatient(userId: string,
                     firstName: string,
                     lastName: string,
                     gender: string,
                     dateOfBirth: string,
                     contactAddress: string,
                     contactPhoneNumber: string,
                     emergencyContactName: string,
                     emergencyContactAddress: string,
                     emergencyContactPhone: string) {

        const tx = await this.contract.addPatient(userId,
            {
                firstName, lastName, gender, dateOfBirth, contactAddress,
                contactPhoneNumber, emergencyContactName,
                emergencyContactAddress, emergencyContactPhone
            });

        await tx.wait();

        console.log('tx:addPatient', tx);

        // @ts-ignore
        console.log('verify-transaction', networkConfig[this.selectedChainId].explorerURL + tx.hash)
    }

    async getPatient(userId: string): Promise<IPatientData> {
        const response = await this.contract.getPatient(userId);
        const data = response[1];

        console.log('tx:getPatient', userId, response);

        return  {
            contactAddress: data['contactAddress'],
            dateOfBirth: data['dateOfBirth'],
            emergencyContactAddress: data['emergencyContactAddress'],
            emergencyContactPhone: data['emergencyContactPhone'],
            emergencyContactName: data['emergencyContactName'],
            contactPhoneNumber: data['contactPhoneNumber'],
            firstName: data['firstName'],
            lastName: data['lastName'],
            gender: data['gender'],
        };
    }

    async doesUserProfileExist(walletAddress: string): Promise<boolean> {
        return await this.contract.doesUserExist(walletAddress);
    }

    async initUserRole(userId: string): Promise<number> {
        this.currentUserRole = await this.contract.getUserRole(userId);

        return this.currentUserRole!;
    }

    isPatient() : boolean {
        return this.currentUserRole === this.USER_PATIENT;
    }

    isPhysician() : boolean {
        return this.currentUserRole === this.USER_PHYSICIAN;
    }

    async addPhysician(userId: string,
                       firstName: string,
                       lastName: string,
                       email: string,
                       gender: string,
                       specialty: string,
    ) {

        const tx = await this.contract.addPhysician(userId, firstName, lastName, email, gender, specialty);

        await tx.wait();

        console.log('tx:addPhysician', tx);
        // @ts-ignore
        console.log('verify-transaction', networkConfig[this.selectedChainId].explorerURL + tx.hash)

    }

    async getPhysician(userId: string): Promise<IPhysicianData> {
        const data = await this.contract.getPhysician(userId);
        console.log('tx:getPhysician', data);

        return  {
            firstName: data['firstName'],
            lastName: data['lastName'],
            email: data['email'],
            gender: data['gender'],
            specialty: data['specialty'],
        };
    }

    async getPhysicianByAddress(walletAddress: string): Promise<IPhysicianData | null | undefined> {
        try {
            const data = await this.contract.getPhysicianByAddress(walletAddress);
            console.log('tx:getPhysicianByAddress', data);
            return {
                userId: data['userId'],
                firstName: data['firstName'],
                lastName: data['lastName'],
                email: data['email'],
                gender: data['gender'],
                specialty: data['specialty'],
            }
        } catch (error) {
            console.error('Physician not found!', error);
        }
    }

    async setPatientAuthorisedPhysician(patientUserId: string, physicianUserId: string) {
        const tx = await this.contract.setPatientAuthorisedPhysician(patientUserId, physicianUserId);
        console.log('tx:setPatientAuthorisedPhysician', tx);
        // @ts-ignore
        console.log('verify-transaction', networkConfig[this.selectedChainId].explorerURL + tx.hash)
    }

    async getPatientAuthorisedPhysician(): Promise<IPhysicianData | null | undefined> {
        try {
            const data = await this.contract.getPatientAuthorisedPhysician();

            console.log('tx:getPatientAuthorisedPhysician', data);
            return <IPhysicianData>{
                firstName: data['firstName'],
                lastName: data['lastName'],
                email: data['email'],
                gender: data['gender'],
                specialty: data['specialty'],
            }
        } catch (error){
            console.error('Physician not found!', error);
        }

        return null;
    }

    async revokePatientAuthorisedPhysician() {
        await this.contract.unsetPatientAuthorisedPhysician();
    }

    async getPatientsAssignedToPhysician(): Promise<IPatientData[]>{
        const responsePayload = await this.contract.getPatientsAssignedToPhysician();
        let patients: IPatientData[] = [];

        console.log('tx:getPatientsAssignedToPhysician', responsePayload);
        for(let i = 0; i < responsePayload.length; i++) {
            const data = responsePayload[i];
            const profile = data['profile'];
            patients.push({
                contactAddress: profile['contactAddress'],
                contactPhoneNumber: profile['contactPhoneNumber'],
                dateOfBirth: profile['dateOfBirth'],
                emergencyContactAddress: profile['emergencyContactAddress'],
                emergencyContactName: profile['emergencyContactName'],
                emergencyContactPhone: profile['emergencyContactPhone'],
                firstName: profile['firstName'],
                lastName: profile['lastName'],
                gender: profile['gender'],
                userId: data['userId'],
            });
        }

        return patients;
    }

    async addMedicalRecord(patientUserId:string, physicianUserId:string, diagnosis: string, treatment: string): Promise<void> {
        const tx = await this.contract.addMedicalRecords(
            patientUserId,
            [0, 0, diagnosis, treatment, physicianUserId],
        );

        await tx.wait();

        // @ts-ignore
        console.log('verify-transaction', networkConfig[this.selectedChainId].explorerURL + tx.hash)

        console.log('tx:addMedicalRecord', tx);
    }

    async getPatientRecords(patientUserId:string): Promise<IMedicalRecord[]> {
        const data = await this.contract.getPatientRecords(patientUserId);
        let medicalRecords: IMedicalRecord[] = [];

        for(let i = 0; i < data.length; i++) {
            const record = data[i];

            medicalRecords.push({
                treatment: record['treatment'],
                timestamp: new Date(record.timestamp.toNumber() * 1000),
                diagnosis: record['diagnosis'],
            });
        }

        console.log('tx:getPatientRecords', medicalRecords);

        return medicalRecords;
    }

    initEventListeners() {
        this.contract.on('MedicalRecord_Saved', (from, to, amount, event) => {
            console.log('MedicalRecord_Saved', from, to, amount, event);
        })
    }

    async seedFundToWallet(recipient: string) {
        // @ts-ignore
        const rpcUrl = networkConfig[this.selectedChainId].rpcUrl;
        const adminWalletPrivateKey = process.env.adminWalletPrivateKey;

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        //
        // // create wallet using private address and provider
        const wallet = new ethers.Wallet(adminWalletPrivateKey!, provider)
        //
        const amountInEther = '0.001'
        //
        // // transaction data, recipient and value in wei
        const txData = {
            to: recipient,
            value: ethers.utils.parseEther(amountInEther)// eth to wei
        }
        console.log(`Sending ${amountInEther}eth to ${recipient}`)

        // send transaction with the wallet
        const tx = await wallet.sendTransaction(txData)
        console.log(`Waiting tx... ${tx.hash}`)

        // wait transaction to confirm at least 1 block
        const finishedTx = await tx.wait()
        console.log(`Tx executed ${finishedTx}`, finishedTx)
        // @ts-ignore
        console.log('verify-transaction', networkConfig[this.selectedChainId].explorerURL + finishedTx.hash)
    }
}
