<?php

use App\Models\Discount;
use App\Models\Donut;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tariffs', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Discount::class);
            $table->foreignIdFor(Donut::class);
            $table->string('quantity');
            $table->float('percentage_discount');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tariffs');
    }
};
