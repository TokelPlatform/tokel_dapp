export default {
  rules: [
    {
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            plugins: [require.resolve('react-refresh/babel')].filter(Boolean),
          },
        },
      ],
    },
    {
      test: /\.global\.css$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /^((?!\.global).)*\.css$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
            sourceMap: true,
            importLoaders: 1,
          },
        },
      ],
    },
    // SASS support - compile all .global.scss files and pipe it to style.css
    {
      test: /\.global\.(scss|sass)$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
    },
    // SASS support - compile all other .scss files and pipe it to style.css
    {
      test: /^((?!\.global).)*\.(scss|sass)$/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: '@teamsupercell/typings-for-css-modules-loader',
        },
        {
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
            sourceMap: true,
            importLoaders: 1,
          },
        },
        {
          loader: 'sass-loader',
        },
      ],
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
    // SVG Font
    {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml',
        },
      },
    },
    // Common Image Formats
    {
      test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
      use: 'url-loader',
    },
  ],
};
