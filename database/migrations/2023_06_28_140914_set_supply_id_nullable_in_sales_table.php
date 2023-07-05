<?php

use App\Models\Supply;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sales', static function (Blueprint $table) {
            $table->foreignIdFor(Supply::class)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('sales', static function (Blueprint $table) {
            $table->foreignIdFor(Supply::class)->change();
        });
    }
};
