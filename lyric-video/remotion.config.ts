/**
 * Remotion configuration.
 *
 * Keep the Studio bundler dependency-light so it works reliably in
 * GitHub Codespaces and forwarded browser ports.
 */
import {Config} from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
