import { Modal } from "antd";
import { useState } from "react";

const DepositModal = ({ users, open, onOk, onCancel, onDeposit,title }) => {
    console.log('user',users)
    const [selectedUser, setSelectedUser] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onDeposit(selectedUser, amount);
        onCancel();
    };

    return (
        <Modal
            open={open}
            onOk={onOk}
            onCancel={onCancel}
        >
            <div className="modal-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group flex gap-4 items-center my-8">
                        <label htmlFor="user">Select User:</label>
                        <select
                            id="user"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            required
                        >
                            <option value="">Select User</option>
                            {users?.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group flex gap-4 items-center my-8">
                        <label htmlFor="amount">Amount:</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {title}
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default DepositModal;
