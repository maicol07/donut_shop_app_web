<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customers', static function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('fiscal_code')->unique();
            $table->date('birth_date')->nullable();
            $table->string('street');
            $table->string('house_number');
            $table->string('cap');
            $table->string('city');
            $table->string('province');
            $table->string('email');
            $table->string('vat_number')->nullable();
            $table->timestamps();

            $table->foreign('vat_number')->references('vat_number')->on('companies');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
