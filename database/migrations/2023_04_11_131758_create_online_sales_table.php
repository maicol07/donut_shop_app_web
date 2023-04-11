<?php

use App\Models\Sale;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('online_sales', static function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string("username");
            $table->foreign("username")->references("username")->on("accounts");
            $table->foreignIdFor(Sale::class);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('online_sales');
    }
};
