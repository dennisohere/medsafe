const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedSafe", function () {
    let MedSafe;
    let medSafe;
    let owner;
    let patient;
    let physician;
    let addr1;

    beforeEach(async function () {
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        patient = accounts[1];
        physician = accounts[2];
        addr1 = accounts[3];

        MedSafe = await ethers.getContractFactory("MedSafe");
        medSafe = await MedSafe.connect(owner).deploy();
    });

    describe("Deployment", function () {
        it("Should set the right contract owner", async function () {
            expect(await medSafe.getContractOwner()).to.equal(owner.address);
        });
    });

    describe("Patient Management", function () {
        it("Should add a patient", async function () {
            const patientProfile = {
                firstName: "John",
                lastName: "Doe",
                gender: "Male",
                dateOfBirth: "1990-01-01",
                contactAddress: "123 Main St",
                contactPhoneNumber: "1234567890",
                emergencyContactName: "Jane Doe",
                emergencyContactAddress: "456 Elm St",
                emergencyContactPhone: "0987654321"
            };

            await medSafe.connect(patient).addPatient("patient1", patientProfile);

            const savedPatient = await medSafe.getPatientByAddress(patient.address);
            expect(savedPatient.userId).to.equal("patient1");
            expect(savedPatient.profile.firstName).to.equal("John");
        });
    });

    describe("Physician Management", function () {
        it("Should add a physician", async function () {
            await medSafe.connect(physician).addPhysician(
                "physician1",
                "Dr.",
                "Smith",
                "dr.smith@example.com",
                "Male",
                "Cardiology"
            );

            const savedPhysician = await medSafe.connect(physician).getPhysician("physician1");
            expect(savedPhysician.userId).to.equal("physician1");
            expect(savedPhysician.firstName).to.equal("Dr.");
            expect(savedPhysician.lastName).to.equal("Smith");
        });

    });

    describe("Authorization", function () {
        beforeEach(async function () {
            await medSafe.connect(patient).addPatient("patient1", {
                firstName: "John",
                lastName: "Doe",
                gender: "Male",
                dateOfBirth: "1990-01-01",
                contactAddress: "123 Main St",
                contactPhoneNumber: "1234567890",
                emergencyContactName: "Jane Doe",
                emergencyContactAddress: "456 Elm St",
                emergencyContactPhone: "0987654321"
            });

            await medSafe.connect(physician).addPhysician(
                "physician1",
                "Dr.",
                "Smith",
                "dr.smith@example.com",
                "Male",
                "Cardiology"
            );
        });

        it("Should allow a patient to authorize a physician", async function () {
            await medSafe.connect(patient).setPatientAuthorisedPhysician("patient1", "physician1");
            const authorizedPhysician = await medSafe.connect(patient).getPatientAuthorisedPhysician();
            expect(authorizedPhysician.userId).to.equal("physician1");
        });

        it("Should allow a patient to revoke physician authorization", async function () {
            await medSafe.connect(patient).setPatientAuthorisedPhysician("patient1", "physician1");
            await medSafe.connect(patient).unsetPatientAuthorisedPhysician();
            await expect(medSafe.connect(patient).getPatientAuthorisedPhysician())
                .to.be.revertedWith("No assigned physician found!");
        });
    });

    describe("Medical Records", function () {
        beforeEach(async function () {
            await medSafe.connect(patient).addPatient("patient1", {
                firstName: "John",
                lastName: "Doe",
                gender: "Male",
                dateOfBirth: "1990-01-01",
                contactAddress: "123 Main St",
                contactPhoneNumber: "1234567890",
                emergencyContactName: "Jane Doe",
                emergencyContactAddress: "456 Elm St",
                emergencyContactPhone: "0987654321"
            });

            await medSafe.connect(physician).addPhysician(
                "physician1",
                "Dr.",
                "Smith",
                "dr.smith@example.com",
                "Male",
                "Cardiology"
            );

            await medSafe.connect(patient).setPatientAuthorisedPhysician("patient1", "physician1");
        });

        it("Should allow an authorized physician to add medical records", async function () {
            const medicalRecord = {
                id: 0,
                timestamp: 0,
                diagnosis: "Hypertension",
                treatment: "Prescribed ACE inhibitors",
                physicianId: "physician1"
            };

            await medSafe.connect(physician).addMedicalRecords("patient1", medicalRecord);

            const patientRecords = await medSafe.connect(patient).getPatientRecords("patient1");
            expect(patientRecords.length).to.equal(1);
            expect(patientRecords[0].diagnosis).to.equal("Hypertension");
        });

        it("Should not allow unauthorized physicians to add medical records", async function () {
            const medicalRecord = {
                id: 0,
                timestamp: 0,
                diagnosis: "Hypertension",
                treatment: "Prescribed ACE inhibitors",
                physicianId: "physician2"
            };

            await expect(medSafe.connect(addr1).addMedicalRecords("patient1", medicalRecord))
                .to.be.revertedWith("Physician is not authorised by patient");
        });
    });
});
