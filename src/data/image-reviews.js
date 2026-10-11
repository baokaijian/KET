// Codex visual review of the actual raster files, not a human listening sign-off.
// A changed file invalidates its review because the tests compare these hashes.
export const imageReviews = {
  apple: {
    status: "pass",
    sha256: "bb5e4781fa802af8c838d65f227efc194a045c47c29d118055b9b629afcb9669",
    note: "Red apple, stem and green leaf clearly visible; no competing object.",
  },
  banana: {
    status: "pass",
    sha256: "59db6b3e0caaff8169007300ad5d48ef5ff169eb3e63bb816a863d14fa1cb4fd",
    note: "Single whole yellow banana with curved shape and peel.",
  },
  bread: {
    status: "pass",
    sha256: "0218642181eb8504f17fc68ae1865553a54d96177fc6717f399863b25c1bf4be",
    note: "Bread loaf and slices, crust and crumb visible; not a cake.",
  },
  milk: {
    status: "pass",
    sha256: "b089ea0619cf548b01df83252d2611a62a57b2c09870ce17a7a3f086a848710a",
    note: "White milk in a clear glass; liquid and container distinguishable.",
  },
  cat: {
    status: "pass",
    sha256: "632f1340f0415152d2385407f2cfda5971f22181b832830a389dcc2b2f112409",
    note: "Domestic tabby cat sitting; ears, whiskers, paws and tail visible.",
  },
  dog: {
    status: "pass",
    sha256: "864a2a32312e3c7375fe719afe3a49e623066cf93574d7dbbba50fbc39e96ed9",
    note: "Golden retriever dog sitting; muzzle, paws and tail visible.",
  },
  rabbit: {
    status: "pass",
    sha256: "ff287737ac00c4b4ebe07efe6fb9c4ebd7797c03292bc29b0204c0d950d9a3a5",
    note: "White rabbit with long upright ears; whole animal identifiable.",
  },
  fish: {
    status: "pass",
    sha256: "277d1cba481d6b6d608ccfb4496b2b4d3ca40e69fc827e0383821a3f56dc706e",
    note: "Live goldfish underwater with fins and tail; noun animal sense, not cooked food.",
  },
  book: {
    status: "pass",
    sha256: "9a32f071db0cd9fdbc6a6c1478110f08fc81d10a7d8112555b0130c7fe411f09",
    note: "Open bound hardcover book with pages; teaches noun sense only, not booking a ticket.",
  },
  pencil: {
    status: "pass",
    sha256: "a8d5b72eb4a7d693ec30736880d93d9c2f655b41d9e62b04eff568abdb76f81c",
    note: "Sharpened wooden pencil with exposed graphite point, not a pen.",
  },
  bicycle: {
    status: "pass",
    sha256: "25212441129401d1fadff63fcbc6a7c3db907e4a6c1094da44ee8d8d987f8d8d",
    note: "Green bicycle with two wheels, pedals, saddle and handlebar, no engine.",
  },
  bus: {
    status: "pass",
    sha256: "bed9bb30698a4429c46a74ac571033f817f0ca922d3634a464cd2bd408b8b2d4",
    note: "Red passenger bus, multiple windows, seats and passenger doors, not a truck.",
  },
};
