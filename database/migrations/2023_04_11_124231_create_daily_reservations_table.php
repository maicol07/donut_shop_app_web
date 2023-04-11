<?php

use App\Models\Donut;
use App\Models\Supply;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_reservations', static function (Blueprint $table) {
            $table->foreignIdFor(Donut::class);
            $table->foreignIdFor(Supply::class)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_reservations');
    }
};
