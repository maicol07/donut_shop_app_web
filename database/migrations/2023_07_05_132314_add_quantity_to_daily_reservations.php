<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_reservations', static function (Blueprint $table) {
            $table->integer('quantity')->after('supply_id');
        });
    }

    public function down(): void
    {
        Schema::table('daily_reservations', static function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};
