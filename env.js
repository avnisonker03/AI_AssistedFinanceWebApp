const host="http://localhost:3000/"
// const host="https://ai-assistedfinancewebapp.onrender.com/"

const API_ENDPOINTS={
    login:`${host}user/login-user`,
    registeration:`${host}user/register-user`,
    googleSignIn:`${host}user/auth/google`,
    sendOTP:`${host}user/send-otp`,
    verifyOTP:`${host}user/verify-otp`,
    dashboard:`${host}user/user-dashboard`,
    budgetList:`${host}user/budget/get-all-budget-lists`,
    createNewBudget:`${host}user/budget/create-budget`,
    updateBudget:(budgetId) => `${host}user/budget/update-budget/${budgetId}`,
    deleteBudget:(budgetId) => `${host}user/budget/delete-budget/${budgetId}`,
    expenseList:`${host}user/expense/get-expense-lists`,
    createExpense:(budgetId)=>`${host}user/expense/create-expense/${budgetId}`,
    deleteExpense:(budgetId,expenseId) => `${host}user/expense/delete-expense/${budgetId}/${expenseId}`,
    expenseListUnderAbudget:(budgetId)=>`${host}user/budget/get-all-expense-lists-under-budget/${budgetId}`,
    incomeList:`${host}user/income/get-income-lists`,
    createIncome:`${host}user/income/create-income-source`,
    deleteIncome:(incomeId)=>`${host}user/income/delete-income-source/${incomeId}`,
    editIncome:(incomeId)=>`${host}user/income/update-income-source/${incomeId}`
}

export default API_ENDPOINTS