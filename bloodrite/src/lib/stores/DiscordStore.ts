import { TOKEN } from '$env/static/private';
import { Client, Events, GatewayIntentBits } from 'discord.js';

export const DiscordClient = new Client({ intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds] });
DiscordClient.login(TOKEN);
DiscordClient.addListener(Events.ClientReady, () => console.log('Client is logged in!'))
