import { UserDTO } from "../user/UserDTO";

export class PaymentHistoryDTO {

    paymentId: number;
    selectedPlan: number;
    createdOn: Date;
    statusId: number;
    createdBy: UserDTO;
    isYearly: boolean;
    amount: number;
    seatCounts: number;

    constructor(
        paymentId: number,
        selectedPlan: number,
        createdOn: Date,
        statusId: number,
        createdBy: UserDTO,
        isYearly: boolean,
        amount: number,
        seatCounts: number
    ) {
        this.paymentId = paymentId;
        this.selectedPlan = selectedPlan;
        this.createdOn = createdOn;
        this.statusId = statusId;
        this.createdBy = createdBy;
        this.isYearly = isYearly;
        this.amount = amount;
        this.seatCounts = seatCounts;
    }
}