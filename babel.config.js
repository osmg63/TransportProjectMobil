module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      '@babel/plugin-transform-private-methods',
      {
        loose: true, // 'loose' seçeneği eklenerek hatayı çözmek için ayarlandı
      },
    ],
    [
      '@babel/plugin-transform-class-properties',
      {
        loose: true, // Diğer eklentilerle uyumlu hale getirildi
      },
    ],
    [
      '@babel/plugin-transform-private-property-in-object',
      {
        loose: true, // Tutarlılık sağlandı
      },
    ],
  ],
};
