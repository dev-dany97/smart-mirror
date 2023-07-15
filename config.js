/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		//{
		//	module: "updatenotification",
		//	position: "top_bar"
		//},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "calendar",
			header: "Kalender",
			position: "top_left",
			config: {
				calendars: [
					//{
					//	fetchInterval: 7 * 24 * 60 * 60 * 1000,
					//	symbol: "calendar-check",
					//	url: "https://ics.tools/Feiertage/bayern.ics"
					//},
					{
						//fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: 'webcal://localhost:8080/modules/Calendar/merged.ics'  //"file:///home/dany/.vdirsyncer/calendars/combined/merged.ics"
					}
				],
				maximumEntries: 20, // Anzahl der Einträge, die angezeigt werden
				maximumNumberOfDays: 30, // Anzahl der Tage in die Zukunft
				customEvents: [
				{keyword: 'Geburtstag', symbol: 'birthday-cake', color: 'Gold'},
				{keyword: 'Daily Standup', symbol: 'fa-users', color: 'Orange'},
				{keyword: 'Micra', symbol: 'fa-car', color: 'Blue'},
				{keyword: 'fest', symbol: 'fa-mug-cheers', color: 'Cyan'},
				{keyword: 'Meeting', symbol: 'fa-users', color: 'Orange'},
				{keyword: 'Friseur', symbol: 'fa-cut', color: 'Brown'},
				{keyword: 'arzt', symbol: 'fa-user-md', color: 'Red'}
				]
			}
		},
		{
            module: 'MMM-CoinMarketCap',
            position: "top_left",
            header: "Cryptocurrencies",
            config: {
                apiKey: 'YOUR_COINMARKETCAP_API_KEY',
                currencies: ['bitcoin', 'ethereum', 'avalanche', 'xrp', 'solana', 'iota', 'litecoin'],
                view: 'graphColored',
                conversion: 'EUR',
				logoColored: true,
				graphColored: true,
				retryDelay:  300, //sec
				updateInterval: 15 //minutes (minimum 5)
                // See below for more Configuration Options
            }
        },
		{
			module: "MMM-AVStock",
			position: "bottom_center", //"bottom_bar" is better for `mode:ticker`
			config: {
				timeFormat: "DD-MM HH:mm",
				width: "600px",
				classes: "xsmall",
				direction: "column",
				symbols : ["ALIZF", "SMAWF", "AMZN", "KLKNF", "SHOP", "BBAI", "NVDA", "AAPL"],
				alias: ["Allianz", "Siemens", "Amazon", "Kloeckner", "Shopify", "BigBear.ai", "Nvidia", "Apple"],
				purchasePrice: [0, 0, 0, 0, 0, 0],
				tickerDuration: 10, //default 20
				//movingAverage: { type: "SMA", periods: [400]},
				chartDays: 90,
				maxTableRows: null,
				mode : "table",                  // "table" or "ticker"
				showChart: true,
				pureLine: false,
				//chartWidth: "900px",
				showVolume: false,
				chartInterval: "daily",          // choose from ["intraday", "daily", "weekly", "monthly"]
				decimals : 2,
				chartType: 'candlestick',                // 'line', 'candlestick', or 'ohlc'
				alternateGridColor: '#000000',
				chartLineColor: '#eee',
				chartLabelColor: '#eee',
				coloredCandles: true,
				showPurchasePrices: true,
				showPerformance2Purchase: false,
				debug: false
			}
		},
		{
			module: "MMM-NINA",
			position: "top_bar",
			config: {
				ags: ["093620000000"], // Liste der Gemeinden, die abgefragt werden sollen
				downgradeLhpSeverity: false,
				downgradeCancelSeverity: true,
				hideCancelledWarnings: false,
				excludeProviders: [], // Mögliche Werte ["MOWAS", "DWD", "BIWAPP", "LHP"]
				maxAgeInHours: 6,
				maxWidth: "200px",
				mergeAlertsById: true,
				mergeAlertsByTitle: true,
				orderBySeverity: true,
				showIcon: true,
				showDate: true,
				showCity: true,
				showNoWarning: false,
				theme: "top", // Erlaubte Werte: top, top-floating, side
				updateIntervalInSeconds: 240,

			}
		},
		//{
		//	module: "compliments",
		//	position: "lower_third"
		//},
		{
            module: 'MMM-WetterOnline',
            position: "top_right",
            config: {
                city: "regensburg",
                daysTrend: "3",
				updateIntervalMins: 30,
				showAirPressure: "hpa",
				width: "400px"
                // See below for for more configurable options
            }
        },
		//{
		//	module: "newsfeed",
		//	position: "bottom_bar",
		//	config: {
		//		feeds: [
		//			{
		//				title: "New York Times",
		//				url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
		//			}
		//		],
		//		showSourceTitle: true,
		//		showPublishDate: true,
		//		broadcastNewsFeeds: true,
		//		broadcastNewsUpdates: true
		//	}
		//},
		{
    		module: 'MMM-Remote-Control',
    		config: {
				apiKey: 'YOUR_REMOTE_CONTROL_API_KEY'
			}
    	},
		{
			module: 'netatmo',
			position: 'bottom_right', // the location where the module should be displayed
			header: 'Netatmo', // a header if you like one
			config: {
				clientId: 'YOUR_NETATMO_CLIENT_ID', // your app id
				clientSecret: 'YOUR_NETATMO_CLIENT_SECRET', // your app secret
				refresh_token: 'YOUR_NETATMO_REFRESH_TOKEN', // your generated refresh token
				refreshInterval: 20,
				design: "bubbles",
				showBattery: false,
				showRadio: false,
				showWifi: false,
				horizontal: false,
				fontClassMeasurement: "small"
			}
		},
		{
			module: 'MMM-Tado',
			position: 'top_right', // This can be any of the regions.
			config: {
				username: 'YOUR_TADO_EMAIL', 
				password: 'YOUR_TADO_PASSWORD', 
				updateInterval: 600000
			}
		}
		// {
			//module: "MMM-CalendarWeek",
			// module: "calendar",
			// position: "top_left",	// This can be any of the regions. Best results in bottom region.
			// module: "calendar",
			// header: "Kalender",
			// config: {
				//colored: true,
				//coloredSymbolOnly: false,
				// calendars: [
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/0B04B6CD-CA03-4E0E-BC55-448E142320AC/006DB5A2-CF1B-454D-BD55-02A013DABF63.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/B47952A1-F43D-4B17-8B2D-855A1AFEB620/09E700B2-6EDC-43CB-A4C7-A4D54B8F430F.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/3E527C88-3C5B-4AB2-8022-B7A166B85E63/9E83019D-22A0-4FF4-9BC4-84D95C033F51.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/b9b78e2f-e73d-4f10-978f-24dce2fdca0b/22159d6f-909c-4ba5-86ad-d73d1f6ac219.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/4F4BECA2-D894-447F-8CB2-F8DA98DB5526/0DFF559A-6182-4302-A488-D129432F5F77.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/CD419CC5-8B3F-4EFE-A4B4-6C8158290028/311952BB-12C2-4105-995D-C751DF31368D.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/52740F8C-34F1-44FA-9834-54BE04805916/2965352A-7B24-49F6-91D5-C5AD0BD7E97C.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/EDC7D24E-02D7-48E3-B174-A84EBE5895D7/005FD82D-31D6-4B03-9B68-36B491747E1A.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/5B2A11BC-690D-4E7C-8761-206F4E14E0EA/4BAD05CE-27D9-40B7-8B57-007053D8155C.ics",
					// symbol: "calendar"
				// },
				// {
					// url: "file:///home/dany/.vdirsyncer/calendars/8EFF4A11-5211-47EB-91A7-D566A7241293/187BB532-6488-46C2-9568-19BDAE11B0E3.ics",
					// symbol: "calendar"
				// }
					//{
					//	url: 'webcal://pXX-caldav.icloud.com/published/2/YOUR_PRIVATE_CALENDAR_TOKEN',
					//	url: "file:///home/pi/.vdirsyncer/calendars/0B04B6CD-CA03-4E0E-BC55-448E142320AC/
						//url: 'http://www.calendarlabs.com/templates/ical/US-Holidays.ics',
						//symbol: 'calendar',
						//auth: {
						//	user: 'username',
						//	pass: 'superstrongpassword',
						//	method: 'basic'
						//}
					//},
				// ],
				// maximumEntries: 10,
				// maximumNumberOfDays: 5
			// }
		// }
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
