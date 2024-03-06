/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { webpack }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals["node:fs"] = "commonjs node:fs";
    config.externals = [...config.externals, 'hnswlib-node']; 
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs:false,
      path: require.resolve("path-browserify"),
  };
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        },
      ),
    );

    return config;
  }
}

module.exports = nextConfig;