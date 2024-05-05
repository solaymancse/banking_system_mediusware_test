<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transactions extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'transaction_type',
        'amount',
        'fee',
        'date'
    ];

    // relationship
    public function user()
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
}
