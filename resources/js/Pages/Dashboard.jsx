import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import DepositModal from "./DepositModal";
import { format } from "date-fns";

export default function Dashboard({ auth }) {
    const [transactions, setTransactions] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalWithdrawalOpen, setIsModalWithdrawalOpen] = useState(false);
    const [showDepositTransactions, setShowDepositTransactions] =
        useState(false);
    const [showWithdrawalTransactions, setShowWithdrawalTransactions] =
        useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setIsModalWithdrawalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setIsModalWithdrawalOpen(false);
    };

    useEffect(() => {
        if (showDepositTransactions) {
            fetchDepositTransactions();
        } else if (showWithdrawalTransactions) {
            fetchWithdrawalTransactions();
        } else {
            fetchAllTransactions();
        }
        fetchUsers();
        getBal();
       
    }, [showDepositTransactions, showWithdrawalTransactions]);

    const fetchAllTransactions = async () => {
        try {
            const alltrans = await axios.get("/transactions");

            setTransactions(alltrans?.data?.transactions);
        } catch (error) {
            console.error("Error fetching all transactions:", error);
        }
    };
   
    const getBal = async () => {
        try {
            const alltrans = await axios.get("/all");
            console.log("all", alltrans);
            
            setCurrentBalance(alltrans?.data.currentBalance);
        } catch (error) {
            console.error("Error fetching all transactions:", error);
        }
    };

    const fetchDepositTransactions = async () => {
        try {
            const alltrans = await axios.get("/deposit", {
                params: { user_id: auth.user.id },
            });
            setTransactions(alltrans?.data?.transactions);
        } catch (error) {
            console.error("Error fetching deposit transactions:", error);
        }
    };

    const fetchWithdrawalTransactions = async () => {
        try {
            const alltrans = await axios.get("/withdrawal", {
                params: { user_id: auth.user.id },
            });
            setTransactions(alltrans?.data?.transactions);
        } catch (error) {
            console.error("Error fetching withdrawal transactions:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    function isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    const handleDeposit = async (userId, amount) => {
        try {
            const response = await axios.post("/deposit", {
                user_id: userId,
                amount,
            });

          
            const updatedUserData = response.data;
            console.log('data',updatedUserData)
            const updatedUsers = users.map((user) => {
                if (user.id === updatedUserData.id) {
                    return { ...user, balance: updatedUserData.balance };
                } else {
                    return user;
                }
            });
            setUsers(updatedUsers);
            setShowDepositTransactions(false);
            setIsModalOpen(false);
            getBal();
        } catch (error) {
            console.error("Error depositing funds:", error);
        }
    };
    const handlewithdrawl = async (userId, amount) => {
        try {
            const response = await axios.post("/withdrawal", {
                user_id: userId,
                amount,
            });

            const updatedUserData = response.data;
            const updatedUsers = users.map((user) => {
                if (user.id === updatedUserData.id) {
                    return { ...user, balance: updatedUserData.balance };
                } else {
                    return user;
                }
            });
            setUsers(updatedUsers);
            setShowDepositTransactions(false);
            setIsModalOpen(false);
         
            fetchAllTransactions(); // Fetch all transactions to update the transaction list
            getBal();
        } catch (error) {
            console.error("Error depositing funds:", error);
        }
    };

    const handleWithdrawal = async (userId, amount) => {
        try {
            const response = await axios.post("/withdrawal", {
                user_id: userId,
                amount,
            });

            const updatedUserData = response.data.user;
            const updatedUsers = users.map((user) => {
                if (user.id === updatedUserData.id) {
                    return { ...user, balance: updatedUserData.balance };
                } else {
                    return user;
                }
            });
            setUsers(updatedUsers);
            setShowWithdrawalTransactions(false);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error withdrawing funds:", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="flex w-full justify-between">
                            <div className="ml-4">
                                <button
                                    className="btn btn-primary py-2 px-4 bg-blue-800 text-white mt-4"
                                    onClick={showModal}
                                >
                                    Deposit Funds
                                </button>
                            </div>
                            <div className="ml-4">
                                <button
                                    className="btn btn-primary py-2 px-4 bg-blue-800 text-white mt-4"
                                    onClick={() =>
                                        setIsModalWithdrawalOpen(true)
                                    }
                                >
                                    withdrawal
                                </button>
                            </div>
                            <div className="mr-4 flex gap-4">
                                <button
                                    className="btn btn-primary py-2 px-4 bg-blue-800 text-white mt-4"
                                    onClick={() => {
                                        setShowDepositTransactions(false);
                                        setShowWithdrawalTransactions(false);
                                    }}
                                >
                                    All Transactions
                                </button>
                                <button
                                    className="btn btn-primary py-2 px-4 bg-blue-800 text-white mt-4"
                                    onClick={() => {
                                        setShowDepositTransactions(true);
                                        setShowWithdrawalTransactions(false);
                                    }}
                                >
                                    Deposit Transactions
                                </button>
                                <button
                                    className="btn btn-primary py-2 px-4 bg-blue-800 text-white mt-4 ml-4"
                                    onClick={() => {
                                        setShowDepositTransactions(false);
                                        setShowWithdrawalTransactions(true);
                                    }}
                                >
                                    Withdrawal Transactions
                                </button>
                            </div>
                        </div>
                        <DepositModal
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            users={users}
                            onDeposit={handleDeposit}
                            title={"Deposit"}
                        />
                        <DepositModal
                            open={isModalWithdrawalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            users={users}
                            onDeposit={handlewithdrawl}
                            title={"Withdraw"}
                        />
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center mb-4 justify-between  w-[300px]">
                                <h3 className="font-semibold text-lg ">
                                    Current Balance
                                </h3>
                                <h1>${currentBalance}</h1>
                            </div>
                            <h3 className="font-semibold text-lg mb-4">
                                Transactions
                            </h3>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Transaction Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transactions?.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {transaction?.created_at &&
                                                isValidDate(
                                                    transaction?.created_at
                                                )
                                                    ? format(
                                                          new Date(
                                                              Date.parse(
                                                                  transaction?.created_at
                                                              )
                                                          ),
                                                          "MMMM d, yyyy, HH:mm a"
                                                      )
                                                    : ""}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {transaction.transaction_type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                ${transaction.amount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
