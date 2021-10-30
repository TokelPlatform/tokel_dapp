import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default isDev => ({
  rules: [
    {
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: isDev
            ? {
                plugins: [require.resolve('react-refresh/babel')],
              }
            : {},
        },
      ],
    },
    // CSS
    {
      test: /\.css$/,
      use: [
        isDev
          ? { loader: 'style-loader' }
          : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: './',
              },
            },
        'css-loader',
      ],
    },
    // SVG
    {
      test: /\.svg$/,
      use: ['@svgr/webpack', 'url-loader'],
    },
    // WOFF Font
    {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
    },
    // WOFF2 Font
    {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
    },
    // OTF Font
    {
      test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'font/otf',
        },
      },
    },
    // TTF Font
    {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream',
        },
      },
    },
    // EOT Font
    {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      use: 'file-loader',
    },
    // Common Image Formats
    {
      test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
      use: 'url-loader',
    },
  ],
});
