<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('accounts', static function (Blueprint $table) {
            $table->string('username')->primary();
            $table->string('fiscal_code')->unique();
            $table->string('password');
            $table->timestamps();

            $table->foreign('fiscal_code')->references('fiscal_code')->on('customers');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
