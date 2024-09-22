// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MedSafe {
    address private contractOwner;

    uint8 private USER_PATIENT = 1;
    uint8 private USER_PHYSICIAN = 2;

    constructor(){
        contractOwner = msg.sender;
    }

    event Patient_Saved(
        string firstName,
        string lastName,
        string gender,
        string dateOfBirth,
        string contactAddress,
        string contactPhoneNumber,
        string emergencyContactName,
        string emergencyContactAddress,
        string emergencyContactPhone
    );

    event Physician_Saved(
        string firstName,
        string lastName,
        string email,
        string gender,
        string specialty,
        uint256 timestamp
    );

    event MedicalRecord_Saved(
        uint256 timestamp,
        string diagnosis,
        string treatment,
        string physicianId
    );

    struct PatientProfile {
        string firstName;
        string lastName;
        string gender;
        string dateOfBirth;
        string contactAddress;
        string contactPhoneNumber;
        string emergencyContactName;
        string emergencyContactAddress;
        string emergencyContactPhone;
    }

    struct Patient {
        string userId;
        PatientProfile profile;
        uint256 timestamp;
    }

    struct Physician {
        string userId;
        string firstName;
        string lastName;
        string email;
        string gender;
        string specialty;
        uint256 timestamp;
    }

    struct MedicalRecord {
        uint256 id;
        uint256 timestamp;
        string diagnosis;
        string treatment;
        string physicianId;
    }

    mapping(address => string) private addressToUserId;
    mapping(string => uint8) private userIdToRoles;


    mapping(string => MedicalRecord[]) private patientUserIdToMedicalRecords;

    mapping(string => string) private findPhysicianByEmail;

    // patient user id => Patient kyc
    mapping(string => Patient) private patients;

    // physician user id => Physician kyc
    mapping(string => Physician) private physicians;

    // patient id => physician id
    mapping(string => string) private authorisedPhysicians;

    // physician id => array of assigned patient's id
    mapping(string => string[]) private physicianPatients;


    modifier onlyOwner_Patient() {
        string memory userId = addressToUserId[msg.sender];
        require(bytes(patients[userId].userId).length == bytes(userId).length, 'User not allowed!');
        _;
    }

    modifier onlyOwner_Physician() {
        string memory userId = addressToUserId[msg.sender];
        require(bytes(physicians[userId].userId).length == bytes(userId).length, 'User not allowed!');
        _;
    }

    modifier onlyPatientOrAuthorisedPhysician() {
        string memory userId = addressToUserId[msg.sender];
        uint8 userRole = userIdToRoles[userId];
        if (userRole == USER_PATIENT) {
            require(bytes(patients[userId].userId).length == bytes(userId).length, 'Patient not allowed!');
        } else if (userRole == USER_PHYSICIAN) {
            require(bytes(physicians[userId].userId).length == bytes(userId).length, 'Physician not allowed!');
        }
        _;
    }

    modifier onlyAuthorisedPhysician(string memory patientUserId) {
        string memory physicianUserId = addressToUserId[msg.sender];
        require(bytes(authorisedPhysicians[patientUserId]).length == bytes(physicianUserId).length, 'Physician is not authorised by patient');
        _;
    }

    function addPatient(string memory userId, PatientProfile memory patientData) public {
        Patient storage patient = patients[userId];
        patient.userId = userId;
        patient.profile = patientData;
        patient.timestamp = block.timestamp;
        addressToUserId[msg.sender] = userId;
        userIdToRoles[userId] = USER_PATIENT;

        emit Patient_Saved(
            patient.profile.firstName,
            patient.profile.lastName,
            patient.profile.gender,
            patient.profile.dateOfBirth,
            patient.profile.contactAddress,
            patient.profile.contactPhoneNumber,
            patient.profile.emergencyContactName,
            patient.profile.emergencyContactAddress,
            patient.profile.emergencyContactPhone
        );
    }

    function doesUserExist(address userAddress) external view returns (bool){
        return bytes(addressToUserId[userAddress]).length > 0;
    }

    function getUserRole(string memory userId) external view returns (uint8){
        return userIdToRoles[userId];
    }

    function getPatientByAddress(address patientAddress) external view returns (Patient memory){
        string memory userId = addressToUserId[patientAddress];

        return patients[userId];
    }

    function getPatient(string memory patientUserId) external view returns (Patient memory) {
        return patients[patientUserId];
    }

    function getPatientRecords(string memory patientUserId) external onlyPatientOrAuthorisedPhysician() view returns (MedicalRecord[] memory) {
        return patientUserIdToMedicalRecords[patientUserId];
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function addPhysician(string memory userId, string memory firstName, string memory lastName, string memory email,
        string memory gender, string memory specialty) external {
        Physician storage physician = physicians[userId];
        physician.userId = userId;
        physician.firstName = firstName;
        physician.lastName = lastName;
        physician.email = email;
        physician.gender = gender;
        physician.specialty = specialty;
        physician.timestamp = block.timestamp;

        addressToUserId[msg.sender] = userId;
        userIdToRoles[userId] = USER_PHYSICIAN;

        emit Physician_Saved(
            physician.firstName,
            physician.lastName,
            physician.email,
            physician.gender,
            physician.specialty,
            physician.timestamp
        );
    }

    function getPhysician(string memory userId) external onlyOwner_Physician() view returns (Physician memory) {
        return physicians[userId];
    }

    function getPhysicianByAddress(address patientAddress) external view returns (Physician memory){
        string memory userId = addressToUserId[patientAddress];

        return physicians[userId];
    }

    function setPatientAuthorisedPhysician(string memory patientUserId, string memory physicianUserId) external onlyOwner_Patient() {
        authorisedPhysicians[patientUserId] = physicianUserId;

        physicianPatients[physicianUserId].push(patientUserId);
    }

    function unsetPatientAuthorisedPhysician() external onlyOwner_Patient() {
        string memory patientUserId = addressToUserId[msg.sender];
        string memory authorisedPhysicianUserId = authorisedPhysicians[patientUserId];

        removePatientFromPhysician(authorisedPhysicianUserId, patientUserId);
        delete authorisedPhysicians[patientUserId];
    }

    function removePatientFromPhysician(string memory physicianUserId, string memory patientUserId) internal {
        string[] storage assignedPatients = physicianPatients[physicianUserId];

        for (uint i = 0; i < assignedPatients.length; i++) {
            if (bytes(assignedPatients[i]).length == bytes(patientUserId).length) {
                assignedPatients[i] = assignedPatients[assignedPatients.length - 1];
                assignedPatients.pop();
                break;
            }
        }
    }

    function getPatientAuthorisedPhysician() external onlyOwner_Patient() view returns (Physician memory) {
        string memory patientUserId = addressToUserId[msg.sender];
        string memory assignedPhysicianUserId = authorisedPhysicians[patientUserId];

        require(bytes(assignedPhysicianUserId).length > 0, 'No assigned physician found!');

        return physicians[assignedPhysicianUserId];
    }

    function getPatientsAssignedToPhysician() external onlyOwner_Physician() view returns (Patient[] memory){
        string memory physicianUserId = addressToUserId[msg.sender];
        string[] memory assignedPatientUserIds = physicianPatients[physicianUserId];
        Patient[] memory assignedPatients = new Patient[](assignedPatientUserIds.length);

        for (uint i = 0; i < assignedPatientUserIds.length; i++) {
            assignedPatients[i] = patients[assignedPatientUserIds[i]];
        }

        return assignedPatients;
    }

    function addMedicalRecords(
        string memory patientUserId,
        MedicalRecord memory medicalRecord) external onlyAuthorisedPhysician(patientUserId) {

        MedicalRecord[] storage medicalRecords = patientUserIdToMedicalRecords[patientUserId];

        MedicalRecord memory newMedicalRecord = MedicalRecord(
            medicalRecords.length + 1,
            block.timestamp,
            medicalRecord.diagnosis,
            medicalRecord.treatment,
            medicalRecord.physicianId
        );

        medicalRecords.push(newMedicalRecord);

        emit MedicalRecord_Saved(
            newMedicalRecord.timestamp,
            newMedicalRecord.diagnosis,
            newMedicalRecord.treatment,
            newMedicalRecord.physicianId
        );
    }


}
