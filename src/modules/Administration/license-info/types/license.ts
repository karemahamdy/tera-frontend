export interface ActivationInformation {
  numperOfUserInLicense: number;
  numperOfSessionsInLicense: number;
  currentNumperOfUser: number;
  currentNumperOfSessions: number;
  expiryDate: string; 
}

export interface ActivationInformationResponse {
  data: ActivationInformation;
  succeeded: boolean;
  message: string | null;
  statusCode: number;
}
