import { Budget } from '../models/budget.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../../../utils/ApiError.js';
import { checkBudgetAndCreateAlerts } from './alert.service.js';

export const updateBudgetOnNewTransaction = async (userId, transaction) => {
    try {
        const transactionDate = new Date(transaction.date);
        const month = transactionDate.getMonth() + 1;
        const year = transactionDate.getFullYear();

        const user = await User.findById(userId);
        if (!user) throw new ApiError(404, "User not found");

        const budget = await Budget.findOneAndUpdate(
            { userId, month, year },
            { $setOnInsert: { monthlyBudget: user.monthlyBudget } },
            { new: true, upsert: true }
        );

        if (transaction.type === 'Expense') {
            budget.totalSpent += transaction.amount;
            const currentCategorySpent = budget.categorySpent.get(transaction.category) || 0;
            budget.categorySpent.set(transaction.category, currentCategorySpent + transaction.amount);
        }

        const updatedBudget = await budget.save();
        
        // This line calls the alert checker after the budget is saved
        await checkBudgetAndCreateAlerts(updatedBudget);

    } catch (error) {
        console.error("Error updating budget:", error);
    }
};

