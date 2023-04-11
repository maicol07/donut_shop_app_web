<?php

use App\Models\Contract;
use App\Models\Shop;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Contract::class);
            $table->string("fiscal_code");
            $table->foreign("fiscal_code")->references("fiscal_code")->on("employees");
            $table->foreignIdFor(Shop::class);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_assignments');
    }
};
