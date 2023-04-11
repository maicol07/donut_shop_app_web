<?php

use App\Models\Sale;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('shop_sales', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Sale::class);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_sales');
    }
};
