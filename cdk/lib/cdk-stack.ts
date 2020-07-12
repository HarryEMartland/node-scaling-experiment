import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lb from '@aws-cdk/aws-elasticloadbalancingv2';
import {ApplicationListener, ApplicationLoadBalancer, TargetType} from '@aws-cdk/aws-elasticloadbalancingv2';
import {IVpc} from "@aws-cdk/aws-ec2";

export class CdkStack extends cdk.Stack {

    private priority: number;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        this.priority = 10;

        const vpc = new ec2.Vpc(this, "LoadAppVPC", {})

        const cluster = new ecs.Cluster(this, 'LoadAppCluster', {
            clusterName: "LoadApp",
            vpc,
        })

        const loadBalancer = new lb.ApplicationLoadBalancer(this, 'LoadAppLoadBalancer', {
            vpc,
            internetFacing: true
        })

        const listener = loadBalancer.addListener(
            "LoadAppLoadBalanceListener",
            {

                protocol: lb.ApplicationProtocol.HTTP,
                port: 80,
                open: true
            }
        )

        listener.addAction("LoadAppLoadBalancerDefaultAction", {
            action: lb.ListenerAction.fixedResponse(404)
        })

        this.createLoadService(cluster, "256", "512", vpc, listener);
        this.createLoadService(cluster, "512", "1024", vpc, listener);
        this.createLoadService(cluster, "1024", "2048", vpc, listener);
        this.createLoadService(cluster, "2048", "4096", vpc, listener);
    }

    private createLoadService(cluster: ecs.Cluster, cpu: string, memoryMiB: string, vpc: IVpc, listener: ApplicationListener) {
        const loadAppTaskDefinition250 = new ecs.TaskDefinition(this, `LoadAppTaskDefinition${cpu}`, {
            compatibility: ecs.Compatibility.FARGATE,
            cpu,
            memoryMiB,
        });

        new ecs.ContainerDefinition(this, `LoadAppContainerDefinition${cpu}`, {
            image: ecs.ContainerImage.fromRegistry("harrymartland/node-load-app"),
            taskDefinition: loadAppTaskDefinition250,
            environment: {
                "BASE_PATH": `/${cpu}`
            },
            healthCheck: {
                command: ["CMD-SHELL", `curl -f http://127.0.0.1:3000/${cpu}/health || exit 1`]
            }
        }).addPortMappings({containerPort: 3000})

        const service = new ecs.FargateService(this, `LoadAppService${cpu}`, {
            taskDefinition: loadAppTaskDefinition250,
            cluster,
            desiredCount: 1,
            vpcSubnets: {
                availabilityZones: vpc.availabilityZones
            }
        })

        listener.addTargets(
            `LoadAppLoadBalancerTargetGroup${cpu}`,
            {
                protocol: lb.ApplicationProtocol.HTTP,
                port: 80,
                targets: [service],
                deregistrationDelay: cdk.Duration.seconds(5),
                priority: this.priority++,
                conditions: [lb.ListenerCondition.pathPatterns([`/${cpu}*`])],
                healthCheck: {
                    path: `/${cpu}/health`
                }
            }
        )

    }
}
