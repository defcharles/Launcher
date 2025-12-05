import { IMCPItem } from "./IMCPItem";

export interface IMCPProfile {
    AccountID: string;
    ProfileID: string;
    Revision: number;
    Items: Record<string, IMCPItem>;
}