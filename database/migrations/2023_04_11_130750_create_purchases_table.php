<?php

use App\Models\Donut;
use App\Models\Sale;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('purchases', static function (Blueprint $table) {
            $table->foreignIdFor(Sale::class);
            $table->foreignIdFor(Donut::class);
            $table->integer('quantity')->unsigned();
            $table->timestamps();
            $table->unique(['sale_id', 'donut_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
