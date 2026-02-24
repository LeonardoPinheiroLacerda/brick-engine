/**
 * Application entry point.
 *
 * This file is responsible for importing the engine's bootstrap function
 * and the initial game to be executed, effectively launching the application.
 */
import { bootstrap } from './bootstrap';
import GameMenu from './menu/GameMenu';

import './index.ts';

bootstrap(GameMenu);
