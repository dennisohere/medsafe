/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        defaultNetwork: process.env.DEFAULT_NETWORK,
        localhostDeploymentAddress: process.env.LOCALHOST_DEPLOYMENT_ADDRESS,
        polygonAmoyDeploymentAddress: process.env.POLYGON_AMOY_DEPLOYMENT_ADDRESS,
        sepoliaDeploymentAddress: process.env.SEPOLIA_DEPLOYMENT_ADDRESS,
    }
};


export default nextConfig;
