<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employees', static function (Blueprint $table) {
            $table->id();
            $table->string('fiscal_code')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->string('job');
            $table->dateTime('birth_date')->nullable();
            $table->string('street');
            $table->string('house_number');
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->string('province');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
