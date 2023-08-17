<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Binaryk\LaravelRestify\RestifyApplicationServiceProvider;

class RestifyServiceProvider extends RestifyApplicationServiceProvider
{
    /**
     * Register the Restify gate.
     *
     * This gate determines who can access Restify in non-local environments.
     *
     * @return void
     * @noinspection PhpUnusedParameterInspection
     */
    protected function gate(): void
    {
        Gate::define('viewRestify', static function ($user = null) {
            return true;
        });
    }
}
