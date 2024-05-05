<?php

namespace App\Http\Controllers;

use App\Http\Requests\DepositRequest;
use App\Models\Transactions;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function getTransactionsAndBalance()
    {
        // Get the logged-in user
        $user = Auth::user();

        // Retrieve the transactions of the logged-in user
        $transactions = Transactions::where('user_id', $user->id)->get();

        // Retrieve the current balance of the user
        $currentBalance = $user->balance;

        return response()->json([
            'transactions' => $transactions,
            'currentBalance' => $currentBalance,
        ]);
    }

    public function deposit(DepositRequest $request)
    {
        $user = User::findOrFail($request->user_id);

        // Update the user's balance by adding the deposited amount
        $user->balance += $request->amount;
        $user->save();

        // Create a new transaction record
        Transactions::create([
            'user_id' => $user->id,
            'transaction_type' => 'deposit',
            'amount' => $request->amount,
        ]);

        return response()->json(['message' => 'Deposit successful', 'balance' => $user->balance]);
    }
    public function alldeposit(Request $request)
    {
        // Fetch deposit transactions for the specified user
        $depositTransactions = Transactions::where('user_id', $request->user_id)
            ->where('transaction_type', 'deposit')
            ->latest()
            ->get();

        // Return the deposit transactions in JSON format
        return response()->json(['transactions' => $depositTransactions]);
    }



    public function transactions()
    {
        $user = Auth::user();
        $transactions = Transactions::where('user_id', $user->id)->latest()->get();

        return response()->json(['transactions' => $transactions]);
    }

    public function getwithdrawal(Request $request)
    {
        // Fetch deposit transactions for the specified user
        $depositTransactions = Transactions::where('user_id', $request->user_id)
            ->where('transaction_type', 'withdrawal')
            ->latest()
            ->get();

        // Return the deposit transactions in JSON format
        return response()->json(['transactions' => $depositTransactions]);
    }

    public function withdrawal(Request $request)
    {
        // Validate the request
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0.01',
        ]);

        // Retrieve the user and their account type
        $user = User::findOrFail($request->user_id);
        $accountType = $user->account_type;

        // Apply withdrawal rate based on account type
        $withdrawalRate = ($accountType == 'Individual') ? 0.015 : 0.025;

        // Check if it's Friday
        $isFriday = date('N', strtotime('today')) == 5; // 5 represents Friday

        // Check if it's the first withdrawal of the day
        $firstWithdrawalOfDay = Transactions::where('user_id', $user->id)
            ->whereDate('created_at', today())
            ->where('transaction_type', 'withdrawal')
            ->doesntExist();

        // Check if it's the first 1K withdrawal per transaction
        $first1KWithdrawal = ($request->amount <= 1000);

        // Check if it's the first 5K withdrawal each month
        $first5KWithdrawal = Transactions::where('user_id', $user->id)
            ->where('transaction_type', 'withdrawal')
            ->whereMonth('created_at', today()->month)
            ->sum('amount') + $request->amount <= 5000;

        // Determine the withdrawal fee
        $withdrawalFee = $request->amount * $withdrawalRate;
        if ($isFriday || $firstWithdrawalOfDay || $first1KWithdrawal || $first5KWithdrawal) {
            $withdrawalFee = 0; // Free withdrawal
        }

        // Deduct the withdrawal amount and fee from the user's balance
        $user->balance -= $request->amount + $withdrawalFee;
        $user->save();

        // Create a withdrawal transaction record
        Transactions::create([
            'user_id' => $user->id,
            'transaction_type' => 'withdrawal',
            'amount' => $request->amount,
        ]);

        return response()->json(['message' => 'Withdrawal successful']);
    }
}
