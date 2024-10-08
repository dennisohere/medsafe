import {Blockchain} from "@/lib/services/blockchain";
import {ethers} from "ethers";
import {BiconomySmartAccountV2, createSmartAccountClient, PaymasterMode} from "@biconomy/account";
import {networkConfig} from "@/networks.config";
import {selectedChain} from "@/lib/supported_chains";


export class BlockchainWithGasSponsorship extends Blockchain {

    constructor(contract: ethers.Contract, selectedChainId: string, getWalletBalance: any) {
        super(contract, selectedChainId, getWalletBalance);
    }

    async send(tx: ethers.PopulatedTransaction) {

        // @ts-ignore
        const paymaster = networkConfig[selectedChain!.id.toString()]!.paymaster;

        const smartAccount = await createSmartAccountClient({
            signer: this.contract.signer,
            bundlerUrl: paymaster.bundlerUrl,
            biconomyPaymasterApiKey: paymaster.apiKey,
        });

        const userOpResponse =
            await smartAccount!.sendTransaction({
                to: this.contract.address,
                data: tx.data!,
            }, {
                paymasterServiceData: {mode: PaymasterMode.SPONSORED},
            });

        const {transactionHash} = await userOpResponse.waitForTxHash();
        console.log('Transaction Hash', transactionHash);

        const userOpReceipt = await userOpResponse.wait();
        if (userOpReceipt.success == 'true') {
            console.log('UserOp receipt', userOpReceipt);
            console.log('Transaction receipt', userOpReceipt.receipt);
        }
    }

    async addPhysician(userId: string, firstName: string, lastName: string, email: string, gender: string, specialty: string): Promise<void> {
        const tx =
            await this.contract.populateTransaction.addPhysician(userId, firstName, lastName, email, gender, specialty);

        await this.send(tx);

        return ;
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

        const tx = await this.contract.populateTransaction.addPatient(userId,
            {
                firstName, lastName, gender, dateOfBirth, contactAddress,
                contactPhoneNumber, emergencyContactName,
                emergencyContactAddress, emergencyContactPhone
            });

        console.log('popTx:addPatient', tx);

        await this.send(tx);

    }

    async addMedicalRecord(patientUserId:string, physicianUserId:string, diagnosis: string, treatment: string): Promise<void> {
        const tx = await this.contract.populateTransaction.addMedicalRecords(
            patientUserId,
            [0, 0, diagnosis, treatment, physicianUserId],
        );

        console.log('popTx:addMedicalRecord', tx);

        await this.send(tx);
    }
}
