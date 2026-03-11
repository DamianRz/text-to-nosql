if (process.platform === "android") {
  await import("next/dist/build/swc/index.js").then(({ loadBindings }) => loadBindings(true)).catch(() => undefined);
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  compiler: {
    styledComponents: true
  },
  experimental: {
    useWasmBinary: true
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
