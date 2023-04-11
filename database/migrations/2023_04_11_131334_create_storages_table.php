<?php

use App\Models\Ingredient;
use App\Models\Warehouse;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('storages', static function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Warehouse::class);
            $table->foreignIdFor(Ingredient::class);
            $table->float('quantity');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('storages');
    }
};
