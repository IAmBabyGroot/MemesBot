const Discord = require('discord.js');
const token = require('./settings.json').token;
const client = new Discord.Client();
var Member;
var Guild;
var Guilds;

const prefix = "mb."

client.on('ready', function() {
    console.log("Ready");
    client.user.setGame("on " + client.guilds.size + " guild(s)");
});

client.on('guildDelete', guild => {
    console.log(`I have left ${guild.name} at ${new Date()}`);
    client.user.setGame(`on ${client.guilds.size} guild(s)`);
});

client.on('guildCreate', guild => {
    guild.defaultChannel.send(`I have joined ${guild.name}`);
    client.user.setGame(`on ${client.guilds.size} guild(s)`);
});

client.on('guildMemberAdd', function(member) {
    let Guild = member.guild;
    Guild.defaultChannel.send(`Welcome ${member.user.username} to ${Guild.name}!`);
});

client.on('guildMemberRemove', function(member) {
    let Guild = member.guild;
    Guild.defaultChannel.send(`Goodbye ${member.user.username}!`);
});

client.on('channelCreate', function(channel) {
    console.log(`A ${channel.type} channel by the name of ${channel.name} was created @ ${channel.createdAt} on ${channel.guild}`);
    if (channel.type === "text") {
        channel.send(`You created #${channel.name} @ ${channel.createdAt}!`);
    }
});
client.on('messageDelete', function(message) {
    if (message.guild.channels.find("name", "server-log")) {
        var serverLog = message.guild.channels.find("name", "server-log");
        serverLog.send(`${message.author.username} sent ${message} @ ${message.createdAt} in ${message.channel.name}`);
    }
});

client.on('message', function(message) {
    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    // This is the best way to define args. Trust me.
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(prefix.length).toLowerCase();

    switch (command) {
        case "setnick":
            if (message.guild.member(message.author).hasPermission("CHANGE_NICKNAME")) {
            Member = message.mentions.members.first();
                var newNick = args.slice(1).join(" ");
                Member.setNickname(newNick);
                message.channel.send(`${Member.user.tag}'s nick is now: ${newNick}`);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "createrole":
            if (message.guild.member(message.author).hasPermission("MANAGE_ROLES")) {
                Guild = message.guild;
                Guild.createRole({
                    "name": args[0],
                    "color": args[1],
                    "permissions": args[2]
                });
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "setrole":
            if (message.guild.member(message.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                Member = message.mentions.members.first();
                var newRole = args.slice(1).join(" ");
                Guild = message.guild;
                var newrole = Guild.roles.find("name", newRole);
                if (message.guild.ownerID === message.author.id) {
                    
                }
                else if (Member.highestRole.position <= newrole.position) {
                    message.channel.send("Error: You Can't Set A Role Higher Or Equal Than Your Own!");
                    
                }
                Member.removeRoles(Member.roles);
                Member.addRole(newrole);
                message.channel.send(`${Member.user.tag} is now: ${newRole}`);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "addrole":
            if (message.guild.member(message.author).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) {
                Member = message.mentions.members.first();
                var newRole = args.slice(1).join(" ");
                Guild = message.guild;
                var newrole = Guild.roles.find("name", newRole); 
                if (message.guild.ownerID === message.author.id) {
                    
                }
                else if (Member.highestRole.position <= newrole.position) {
                    message.channel.send("Error: You Can't Set A Role Higher Or Equal Than Your Own!");
                    
                }
                Member.addRole(newrole);
                message.channel.send(`${Member.user.tag} has been given: ${newRole}`);
            } else {
                message.reply("Error: You Do Not Have Enough Permission!");
            }
            break;
        case "serverinfo":
            Guild = message.guild;
            message.channel.send("Owner: " + Guild.owner.displayName + "\n\n" + "Main Chat: " + Guild.defaultChannel + "\n\n" + "Region: " + Guild.region + "\n\n" + "Channels: " + Guild.channels.size + "\n\n" + "Members: " + Guild.memberCount + "\n\n" + "Default Role: " + Guild.defaultRole + "\n\n" + "Verification Level: " + Guild.verificationLevel + "\n\n" + "Created At: " + Guild.createdAt);
            break;
        case "help":
            message.channel.send("Commands: serverinfo, addrole, setrole, createrole, setnick, help");
            break;
        default:
            message.reply("That is not a command");
    }

});

client.login(token);