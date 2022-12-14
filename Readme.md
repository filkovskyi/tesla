# Tesla Demo
![](https://github.com/filkovskyi/tesla/blob/master/assets/images/demo.gif)


# Tesla project

Live link: [https://tesla-indol.vercel.app/](https://tesla-indol.vercel.app/)

## Running

First install the dependencies:

```bash
npm install
```

To run the project in development mode:

```bash
npm start
```

Then navigate to [http://localhost:3000/index.html](http://localhost:1234/index.html) in a web browser to see the default scene in a viewer.

The assets are stored in the `assets` directory.

To build the project for production:

```bash
npm run build
```

## Updates

Check the [webgi manual](https://webgi.xyz/docs/manual/#sdk-links) for the latest version.
To use the different version:

- Update the version number in `package.json` file for both `webgi` and `@types/webgi`.
- Run `npm install` to update the dependencies.
- Delete `.cache` folder created by parcel bundler: `rm -rf .cache`
- Run `npm start` or `npm run build` to run or build the project.

## Documentation

For the latest version and documentation: [WebGi Docs](https://webgi.xyz/docs/).

## License

For license and terms of use, see the [SDK License](https://webgi.xyz/docs/license).
