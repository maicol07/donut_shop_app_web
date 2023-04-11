<?php

use App\Models\Shop;
use App\Models\Supply;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales', static function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignIdFor(Shop::class);
            $table->foreignIdFor(Supply::class);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
