<?php

use App\Models\Donut;
use App\Models\Ingredient;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('compositions', static function (Blueprint $table) {
            $table->foreignIdFor(Donut::class);
            $table->foreignIdFor(Ingredient::class);
            $table->integer('absolute_quantity');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('compositions');
    }
};
