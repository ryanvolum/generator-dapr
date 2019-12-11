var Generator = require('yeoman-generator');

module.exports = class extends Generator {

    async prompting() {
        this.answers = await this.prompt([{
                type: "input",
                name: "name",
                message: "What would you like to call your dapr project?",
                default: this.appname // Default to current folder name
            },
            {
                type: "list",
                name: "daprMode",
                message: "Are you running dapr in Kubernetes or in standalone mode?",
                choices: ["Kubernetes", "Standalone"]
            },
            {
                type: "checkbox",
                name: "languages",
                message: "What languages would you like to scaffold microservices for? (Use space bar to check the following)",
                choices: ["C#", "JavaScript", "Python", "TypeScript", "Go"]
            },
            {
                type: "list",
                name: "store",
                message: "What state store (if any) would ,you like your app to use? (Use space bar to check the following)",
                choices: ["Redis", "CosmosDB", "Cassandra", "None"]
            }
        ]);
    }


    configuring() {
        this.log("Configuring project");
    }

    writing() {
        let answers = this.answers;
        let intro = `Great! I'm scaffolding you a ${answers.daprMode} dapr app with`;
        let microservicesText;
        if (answers.languages.length === 0) microservicesText = " no microservices";
        if (answers.languages.length === 1) microservicesText = ` a ${answers.languages[0]} microservice`;
        if (answers.languages.length > 1) {
            microservicesText = ` a ${answers.languages[0]} microservice`;
            for (let i = 1; i < answers.languages.length - 1; i++) {
                microservicesText += `, a ${answers.languages[i]} microservice`;
            }
            microservicesText += ` and a ${answers.languages[answers.languages.length - 1]} microservice`;
        }
        let stateText = (answers.store !== "None") ? `. I'll also create the configuration files for a ${answers.store} state store` : "";
        this.log(`${intro}${microservicesText}${stateText}`);
    }

    install() {
        this.log("Installing your packages:");
    }

    end() {
        // Give dapr run advice
        this.log((this.answers.daprMode === "Kubernetes") ?
            "To run dapr in your Kubernetes cluster, download the dapr CLI (https://github.com/dapr/cli/releases) and run 'dapr init --kubernetes'." :
            "To run dapr in your Standalone mode, download the dapr CLI (https://github.com/dapr/cli/releases) and run 'dapr init'.");

        // Give dapr state advice
        switch (this.answers.store) {
            case "Redis":
                this.log("Next you'll need to create a Redis store and add configuration details to your redis.yaml (see Redis dapr doc)")
                break;
            case "CosmosDB":
                this.log("Next you'll need to create a CosmosDB database in Azure and add configuration details to your redis.yaml (see CosmosDB dapr doc)")
                break;
            case "Cassandra":
                this.log("Next you'll need to create a Cassandra store and add configuration details to your redis.yaml (see Cassandra dapr doc)")
                break;
        }
    }
};