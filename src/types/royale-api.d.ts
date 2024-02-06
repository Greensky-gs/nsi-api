
type clansFilter = {
	name: string;
	minMembers: number;
	locationId: number;
	limit: number
};
type locationType = {
	id: number;
	name: string;
	isCountry: boolean;
};
type clan = {
	tag: string;
	name: string;
	type: string;
	badgeId: number;
	clanScore: number;
	clanWarTrophies: number;
	localtion: locationType[];
	requiredTrophies: number;
	donationsPerWeek: number;
	clanChestLevel: number;
	clanChestMaxLevel: number;
	members: number;
};
type arenaType = {
	id: number;
	name: string,
}
type memberType = {
	tag: string;
	name: string;
	role: "member" | "leader";
	lastSeen: string;
	expLevel: number;
	trophies: number;
	arena: arenaType;
	clanRank: number;
	previousClanRank: number;
	donations: number;
	donationsReceived: number;
	clanChestPoints: number;
}
type cardRarity = "common" | "rare" | "epic" | "lumberjack";

type cardType = {
	name: string;
	id: number;
	maxLevel: number;
	maxEvolutionLevel: number;
	elixirCost: number;
	iconUrls: {
		medium: string;
		evolutionMedium?: string;
	};
	rarity: cardRarity;
}
type playerType = {
	tag: string;
	name: string;
	expLevels: number;
	trophies: number;
	bestTrophies: number;
	wins: number;
	losses: number;
	battleCount: number;
	threeCrownWins: number;
	challengeCardsWon: number;
	challengeMaxWins: number;
	tournamentCardsWon: number;
	tournamentBattleCount: number;
	role: "member" | 'leader';
	donations: number;
	donationsReceived: number;
	totalDonations: number;
	watDayWins: number;
	clanCardsCollected: number;
	clan: {
		tag: string;
		name: string;
		badgeId: number;
	};
	arena: {
		id: number;
		name: string;
	};
	leagueStatistics: {
		currentSeason: {
			trophies: number;
			bestTrophies: number;
		};
		bestSeason: {
			id: string;
			trophies: number;
		};
	};
	badges: badgeType[];
	achievements: achievementType[];
	cards: cardType[];
	supportCard: cardType;
	currentDeck: cardType[];
	currentDeckSupportCards: cardType[];
	currentFavouriteCard: cardType;
	starPoints: number;
	expPoints: number;
	currentPathofLegendSeasonResult: {
		leagueNumber: number;
		trophies: number;
		rank: null
	};
	lastPathOfLegendSeasonResult: {
		leagueNumber: number;
		trophies: number;
		rank: null;
	};
	bestPathOfLegendSeasonResult: {
		leagueNumber: number;
		trophies: number;
		rank: null;
	};
	totalExpPoints: number;
}
type badgeType = {
	name: string;
	level: number;
	maxLevel: number;
	progresse: number;
	target: number;
	iconUrls: {
		large?: string;
		medium?: string;
		small?: string;
	}
}
type achievementType = {
	name: string;
	stars: number;
	value: number;
	target: number;
	info: string;
	completionInfo: null;
}
type upcomingChest = {
	index: number;
	name: string;
}
type playerDomainType = 'upcomingchests' | 'default'
type playerResult<D extends playerDomainType> = D extends 'upcomingchests' ? Promise<{
	data: upcomingChest[]
}> : D extends 'default' ? Promise<{
	data: playerType
}> : never;
class Client {
	constructor(token?: string);
	
	clans(input: string | clansFilter): Promise<{ data: clan; memberList: boolean }>;
	clan(input: string): Promise<{ data: clan & { memberList: memberType[] }; memberList: memberType[] }>;
		
	cards(): Promise<{ data: cardType[]; cardLevels: { EPIC: number; RARE: number; COMMON: number; LEGENDARY: number } }>

	player<T extends playerDomainType = 'default'>(id: string, domain?: T): playerResult<T>
}
	
	
declare module "clash-royale-api" {
	export = Client;
}
	