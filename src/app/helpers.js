export const copyText = ({ text, toast }) => {
  console.log(text);
  /*  const textarea = document.createElement("textarea");
  textarea.textContent = `${text}`;
  textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.body.removeChild(textarea); */
  toast.success("Copied to clipboard");
};

export const imagePreloader = (path) => {
  return new Promise(function (resolve, reject) {
    // Create a new image from JavaScript
    var image = new Image();
    // Bind an event listener on the load to call the `resolve` function
    image.onload = resolve;
    // If the image fails to be downloaded, we don't want the whole system
    // to collapse so we `resolve` instead of `reject`, even on error
    image.onerror = resolve;
    // Apply the path as `src` to the image so that the browser fetches it
    image.src = path;
  });
};

export function waitFor(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export const sciFiSample = {
  storyData: {
    nodes: [
      {
        id: "node-1",
        content: "🟢 Start Here !",
        coordinates: [60, 60],
        outputs: [
          {
            id: "port-Author",
            alignment: "right",
          },
          {
            id: "port-Reader",
            alignment: "right",
          },
        ],
      },
      {
        id: "node-1715452837426_0.7577755121633958",
        content: "Node 1715452837426_0.7577755121633958",
        coordinates: [465, 69],
        data: {
          title: "Branch 1:",
          paragraph:
            "Captain Ava decides to investigate a mysterious signal emanating from a nearby asteroid..",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#87b6e0",
        },
        inputs: [
          {
            id: "port-0.2407769852578392-Author",
          },
          {
            id: "port-0.6937291984329383-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.05591136329849755-Author",
          },
          {
            id: "port-0.9873972251339678-Reader",
          },
        ],
      },
      {
        id: "node-1715452838869_0.30364832243817497",
        content: "Node 1715452838869_0.30364832243817497",
        coordinates: [816, 37],
        data: {
          title: "Branch 1.1: ",
          paragraph:
            "The signal leads them to an alien artifact that grants them advanced technology, propelling humanity into a new era of prosperity.",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#84bdef",
        },
        inputs: [
          {
            id: "port-0.28384375284865815-Author",
          },
          {
            id: "port-0.9877058238641174-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.33955977979084473-Author",
          },
          {
            id: "port-0.0483285963568707-Reader",
          },
        ],
      },
      {
        id: "node-1715452885533_0.13996356418405131",
        content: "Node 1715452885533_0.13996356418405131",
        coordinates: [112, 269],
        data: {
          title: "Prologue",
          paragraph:
            'In the year 2150, aboard the starship "Pioneer," a crew of three embarks on a mission to explore a distant galaxy. As they traverse the cosmos, they encounter a series of unexpected events, each leading to branching paths:',
          editMode: false,
          selected: false,
          blob: "1715519230914_9374",
          blobAudio: "1715521600850_338",
          storyState: "Reader",
          color: "#DAE1E7",
        },
        inputs: [
          {
            id: "port-0.6940372726669415-Author",
          },
          {
            id: "port-0.8002365076186946-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.8833430555293531-Author",
          },
          {
            id: "port-0.6943876292752831-Reader",
          },
        ],
      },
      {
        id: "node-1715452979404_0.8924629351131208",
        content: "Node 1715452979404_0.8924629351131208",
        coordinates: [1179, 73],
        data: {
          title: "Branch 1.2: (Epilogue)",
          paragraph:
            'The artifact triggers a catastrophic chain reaction, threatening to destroy the "Pioneer" and everyone aboard.',
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#80b6e5",
        },
        inputs: [
          {
            id: "port-0.1416068607857306-Author",
          },
          {
            id: "port-0.805911547694361-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.9651862518047094-Author",
          },
          {
            id: "port-0.4898816664621406-Reader",
          },
        ],
      },
      {
        id: "node-1715453040515_0.7521475902511483",
        content: "Node 1715453040515_0.7521475902511483",
        coordinates: [458, 395],
        data: {
          title: "Branch 2:",
          paragraph:
            "First Officer Kai suggests avoiding the asteroid and continuing their original course",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#7bec6f",
        },
        inputs: [
          {
            id: "port-0.32808672548252815-Author",
          },
          {
            id: "port-0.5149273949860085-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.06757137243953282-Author",
          },
          {
            id: "port-0.027617404964457748-Reader",
          },
        ],
      },
      {
        id: "node-1715453125956_0.22781469489507233",
        content: "Node 1715453125956_0.22781469489507233",
        coordinates: [785, 404],
        data: {
          title: "Branch 2:1",
          paragraph:
            "They stumble upon a habitable planet rich in resources, offering hope for humanity's survival.",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#76f27d",
        },
        inputs: [
          {
            id: "port-0.33162396105523606-Author",
          },
          {
            id: "port-0.6967803076101438-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.8493840992235879-Author",
          },
          {
            id: "port-0.5148149621014799-Reader",
          },
        ],
      },
      {
        id: "node-1715453162887_0.17664247356066354",
        content: "Node 1715453162887_0.17664247356066354",
        coordinates: [1113, 422],
        data: {
          title: "Branch 2.2: (Epilogue)",
          paragraph:
            "The planet is inhabited by a hostile alien species, forcing the crew into a desperate battle for survival.",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#86fb7d",
        },
        inputs: [
          {
            id: "port-0.8742186358395305-Author",
          },
          {
            id: "port-0.6594127836788597-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.9528408669554476-Author",
          },
          {
            id: "port-0.7865515437324233-Reader",
          },
        ],
      },
      {
        id: "node-1715453211571_0.8962154238694422",
        content: "Node 1715453211571_0.8962154238694422",
        coordinates: [451, 774],
        data: {
          title: "Branch 3: ",
          paragraph:
            "Scientist Maya proposes studying a peculiar anomaly in space.",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#f08f81",
        },
        inputs: [
          {
            id: "port-0.4864991087198127-Author",
          },
          {
            id: "port-0.20663662860719012-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.869847248663951-Author",
          },
          {
            id: "port-0.04849539982780482-Reader",
          },
        ],
      },
      {
        id: "node-1715453340294_0.2130530943662896",
        content: "Node 1715453340294_0.2130530943662896",
        coordinates: [807, 766],
        data: {
          title: "Branch 3.1",
          paragraph:
            "The anomaly transports them to an alternate reality where Earth is a utopian paradise.",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#f6887a",
        },
        inputs: [
          {
            id: "port-0.5508476159972138-Author",
          },
          {
            id: "port-0.793500475899191-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.6438710554250051-Author",
          },
          {
            id: "port-0.09747117339709699-Reader",
          },
        ],
      },
      {
        id: "node-1715453385964_0.7384545808534371",
        content: "Node 1715453385964_0.7384545808534371",
        coordinates: [1147, 764],
        data: {
          title: "Branch 3.2 (Epilogue)",
          paragraph:
            ": They find themselves trapped in a nightmarish dimension where time is distorted and reality is twisted.",
          editMode: false,
          selected: false,
          blob: "",
          blobAudio: "",
          storyState: "Reader",
          color: "#ed8e84",
        },
        inputs: [
          {
            id: "port-0.027780131852136014-Author",
          },
          {
            id: "port-0.5966600341074442-Reader",
          },
        ],
        outputs: [
          {
            id: "port-0.7877605362024009-Author",
          },
          {
            id: "port-0.7379618799298238-Reader",
          },
        ],
      },
    ],
    links: [
      {
        input: "port-0.6940372726669415-Author",
        output: "port-Author",
      },
      {
        input: "port-0.2407769852578392-Author",
        output: "port-0.8833430555293531-Author",
      },
      {
        input: "port-0.28384375284865815-Author",
        output: "port-0.05591136329849755-Author",
      },
      {
        input: "port-0.1416068607857306-Author",
        output: "port-0.33955977979084473-Author",
      },
      {
        input: "port-0.32808672548252815-Author",
        output: "port-0.8833430555293531-Author",
      },
      {
        input: "port-0.33162396105523606-Author",
        output: "port-0.06757137243953282-Author",
      },
      {
        input: "port-0.8742186358395305-Author",
        output: "port-0.8493840992235879-Author",
      },
      {
        input: "port-0.4864991087198127-Author",
        output: "port-0.8833430555293531-Author",
      },
      {
        input: "port-0.5508476159972138-Author",
        output: "port-0.869847248663951-Author",
      },
      {
        input: "port-0.027780131852136014-Author",
        output: "port-0.6438710554250051-Author",
      },
    ],
  },
  storyId: "1715269266765",
  storyTitle: "",
  bgIndex: 0,
};
