if (process.platform === "android") {
  await import("next/dist/build/swc/index.js").then(({ loadBindings }) => loadBindings(true)).catch(() => undefined);
}

const nextConfig = {
  compiler: {
    styledComponents: true
  },
  experimental: {
    useWasmBinary: true
  }
};

export default nextConfig;
