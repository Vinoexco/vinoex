import { getConfigPath, getEnabledSources, loadSources } from "./config/load-sources";

function main(): void {
  const configPath = getConfigPath();
  const config = loadSources(configPath);
  const enabled = getEnabledSources(config);

  console.log("Vinoex scraper — Phase A");
  console.log(`Config: ${configPath}`);
  console.log(`Defaults: delay ${config.defaults.min_delay_ms}ms, timeout ${config.defaults.page_timeout_ms}ms`);
  console.log(`Sources: ${config.sources.length} configured, ${enabled.length} enabled`);

  if (config.sources.length === 0) {
    console.log("No sources configured yet. Add entries to scraper/config/sources.json.");
  }

  for (const source of config.sources) {
    console.log(`  - ${source.id} (${source.enabled ? "enabled" : "disabled"}): ${source.urls.length} URL(s)`);
  }
}

main();
