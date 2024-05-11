"use client";
import React, { useState } from "react";
import Image from "next/image";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { useEffectOnce, useIsMobile, useLocalStorage } from "./hooks";
import { AudioRecorder } from "react-audio-voice-recorder";
import bg from "../../public/images/medieval_town__free_wallpaper_by_a2a5_dfokr2n.png";
import { toast } from "react-toastify";
import { cloneDeep, uniqBy } from "lodash";
import { ColorRing } from "react-loader-spinner";
import { copyText } from "./helpers";
import HelpModal from "./modals/HelpModal";

/* export default function AudioR() {
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  return (
    <div>
     
      <br />
    </div>
  );
} */

/*  <div>
            <input
              type="checkbox"
              id={`selected_${id}`}
              checked={data.selected}
              onChange={(e) => {
                onChange(
                  schema.nodes.map((el) => {
                    if (el.id == id) {
                      el.data.selected = e.target.checked;
                    }
                    return { ...el };
                  })
                );
              }}
            />
          </div> */

const UncontrolledDiagram = ({ storyIdParam }) => {
  const initialSchema = createSchema({
    nodes: [
      {
        id: "node-1",
        content: "Start Adventure...",
        coordinates: [60, 60],
        outputs: [
          { id: "port-Author", alignment: "right" },
          { id: "port-Reader", alignment: "right" },
        ],
      },
    ],
  });
  // create diagrams schema
  const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);
  const [storyId, setStoryId] = useLocalStorage("storyId", `${Date.now()}`);
  const isMobile = useIsMobile();
  const [storyState, setStoryState] = useState("Author");
  const [isLoading, setIsLoading] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [bgIndex, setBgIndex] = useState("");
  const [showHelpModal, setShowHelpModal] = React.useState(false);

  const deleteNodeFromSchema = (id) => {
    try {
      console.log(id);
      const nodeToRemove = schema.nodes.find((node) => node.id === id);
      console.log(nodeToRemove);
      if (nodeToRemove) removeNode(nodeToRemove);
    } catch (err) {
      console.log(err);
    }
  };

  const save = async ({ payload, copyLink }) => {
    try {
      setIsLoading(true);
      payload.storyData.nodes = uniqBy(payload.storyData.nodes, "id");
      const response = await fetch("/.netlify/functions/savestory", {
        method: "POST",
        body: JSON.stringify({
          ...payload,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log(response);

      if (!response.ok) {
        toast.error("Unable to save story");
      } else {
        toast("Story saved");
        if (copyLink) {
          copyText({
            text: `${window.location.origin}/published/${payload.storyId}`,
            toast,
          });
        }
      }
    } catch (err) {
      toast.error(JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getStory = async ({ storyIdParam }) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/.netlify/functions/getstory/${storyIdParam}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      //  console.log(response);

      if (!response.ok) {
        toast.error("Unable to get story: Refresh");
      } else {
        // populate UI with read only mode
        const data = await response.json();
        // console.log(data);
        // console.log(JSON.parse(data.storyFound));

        const storyFound = JSON.parse(data.storyFound);
        console.log(storyFound);
        setStoryId(storyFound.storyId);
        setBgIndex(storyFound?.bgIndex);

        storyFound.storyData.nodes = storyFound.storyData.nodes.map((el) => {
          return {
            ...el,
            ...(el.id !== "node-1"
              ? {
                  render: CustomRender,
                  data: {
                    ...el.data,
                    storyState: "Reader",
                    editMode: false,
                  },
                }
              : {}),
          };
        });
        console.log(storyFound.storyData, "Reader");
        // clean up
        onChange(storyFound.storyData);
        setStoryTitle(storyFound.storyTitle);
        setStoryState("Reader");
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffectOnce(() => {
    if (storyIdParam)
      getStory({
        storyIdParam,
      });
  });

  const CustomRender = ({ id, content, data, inputs, outputs }) => {
    const onFileSelected = (event) => {
      const selectedFile = event.target?.files[0];
      if (!selectedFile) return;

      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = () => {
        const blob = new Blob([reader.result], {
          type: selectedFile.type,
        });

        onChange(
          schema.nodes.map((el) => {
            if (el.id == id) {
              el.data.blob = blob;
            }
            return { ...el };
          })
        );
      };
    };

    const addAudioElement = (blob) => {
      onChange(
        schema.nodes.map((el) => {
          if (el.id == id) {
            el.data.blobAudio = blob;
          }
          return { ...el };
        })
      );
    };

    return (
      <div
        key={id}
        class="p-0 bg-white rounded-xl transform transition-all -hover:-translate-y-1 duration-300 shadow-lg hover:shadow-2xl relative pt-2"
        style={{ width: "17rem", overflow: "hidden" }}
        /* onClick={(e) => {
          if (e.detail === 2) {
            const portId = e.target.getAttribute("data-port-id");

            
          }
        }} */
      >
        {data?.storyState === "Author" && (
          <div className="absolute right-0 top-0 flex item-center gap-2 p-1 text-xs items-center bg-white">
            <label htmlFor={`editMode_${id}`}>
              <input
                type="checkbox"
                id={`editMode_${id}`}
                className="hidden"
                checked={data.editMode}
                onClick={(e) => {
                  onChange(
                    schema.nodes.map((el) => {
                      if (el.id == id) {
                        el.data.editMode = e.target.checked;
                      }
                      return { ...el };
                    })
                  );
                }}
              />
              🖋️
            </label>

            <button
              className=""
              title={id}
              onClick={() => {
                if (confirm("Delete Paragraph?")) {
                  deleteNodeFromSchema(id);
                }
              }}
            >
              ❌
            </button>
          </div>
        )}
        <div className="p-2">
          {data?.blob && (
            <div className="flex justify-center">
              <img
                class="h-40 object-cover rounded-xl"
                //  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                src={data?.blob ? URL.createObjectURL(data.blob) : ""}
                alt=""
              />
            </div>
          )}

          {data.editMode && (
            <input
              type="file"
              className="mx-2 border rounded w-full p-1"
              onChange={(e) => onFileSelected(e)}
            />
          )}

          <div class="p-2 mb-4">
            {!data.editMode ? (
              <h2 class="font-bold text-md mb-2 p-1">{data.title || "..."}</h2>
            ) : (
              <input
                className="border rounded mb-2 font-bold  text-md p-1"
                placeholder="Enter Heading"
                style={{ width: "100%" }}
                value={data.title}
                id={`title_${id}`}
                onChange={(e) => {
                  onChange(
                    schema.nodes.map((el) => {
                      if (el.id == id) el.data.title = e.target.value;
                      return { ...el };
                    })
                  );
                }}
              />
            )}

            {/*  {content} */}
            {!data.editMode ? (
              <p class="text-xs text-gray-600 line-clamp-3 p-1">
                {data.paragraph || "..."}
              </p>
            ) : (
              <textarea
                className="border rounded text-xs w-100 p-1"
                rows={3}
                placeholder="Enter Paragraph"
                value={data.paragraph}
                id={`paragraph_${id}`}
                onChange={(e) => {
                  onChange(
                    schema.nodes.map((el) => {
                      if (el.id == id) el.data.paragraph = e.target.value;
                      return { ...el };
                    })
                  );
                }}
                style={{ width: "100%" }}
              ></textarea>
            )}

            <div className="mt-4">
              {data.editMode && (
                <AudioRecorder
                  onRecordingComplete={addAudioElement}
                  audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                    // autoGainControl,
                    // channelCount,
                    // deviceId,
                    // groupId,
                    // sampleRate,
                    // sampleSize,
                  }}
                  onNotAllowedOrFound={(err) => console.table(err)}
                  // downloadOnSavePress={true}
                  downloadFileExtension="webm"
                  mediaRecorderOptions={{
                    audioBitsPerSecond: 128000,
                  }}
                  showVisualizer={true}
                  classes={{ AudioRecorderClass: "w-full" }}
                />
              )}
              {data?.blobAudio && (
                <audio
                  src={URL.createObjectURL(data.blobAudio)}
                  controls
                  className="mt-4 w-full"
                />
              )}{" "}
            </div>

            {data.editMode && (
              <div class="m-2">
                <button
                  role="button"
                  href="#"
                  class="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-xs"
                  onClick={() => {
                    onChange(
                      schema.nodes.map((el) => {
                        if (el.id == id) {
                          el.data.editMode = false;
                        }
                        return { ...el };
                      })
                    );
                  }}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 rounded-xl w-full">
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
            title="Author"
          >
            {inputs
              ?.filter((port) => port?.key && !port?.key?.includes("Reader"))
              .map((port) =>
                React.cloneElement(port, {
                  style: {
                    width: "22px",
                    height: "22px",
                    background: "rgb(186, 230, 253)",
                    borderBottomLeftRadius: "inherit",
                    ...(data?.storyState === "Reader"
                      ? { pointerEvents: "none" }
                      : {}),
                  },
                })
              )}
            {outputs
              ?.filter((port) => port?.key && !port?.key?.includes("Reader"))
              .map((port) =>
                React.cloneElement(port, {
                  style: {
                    width: "22px",
                    height: "22px",
                    background: "rgb(22, 78, 99)",
                    borderBottomRightRadius: "inherit",
                    ...(data?.storyState === "Reader"
                      ? { pointerEvents: "none" }
                      : {}),
                  },
                })
              )}{" "}
          </div>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
            title="Reader"
          >
            {inputs
              ?.filter((port) => port?.key && port?.key?.includes("Reader"))
              .map((port) =>
                React.cloneElement(port, {
                  style: {
                    width: "22px",
                    height: "22px",
                    background: "rgb(52, 211, 153)",
                    borderBottomLeftRadius: "inherit",
                  },
                })
              )}
            {outputs
              ?.filter((port) => port?.key && port?.key?.includes("Reader"))
              .map((port) =>
                React.cloneElement(port, {
                  style: {
                    width: "22px",
                    height: "22px",
                    background: "rgb(6, 78, 59)",
                    borderBottomRightRadius: "inherit",
                  },
                })
              )}
          </div>
        </div>
      </div>
    );
  };

  const addNewNode = ({ uniqueKey }) => {
    const nextNode = {
      id: `node-${uniqueKey}`,
      content: `Node ${/* schema.nodes.length + 1 */ uniqueKey}`,
      coordinates: [
        schema.nodes[schema.nodes.length - 1].coordinates[0] + 300,
        schema.nodes[schema.nodes.length - 1].coordinates[1],
      ],
      render: CustomRender,
      data: {
        title: "",
        paragraph: "",
        editMode: true,
        selected: false,
        blob: "",
        blobAudio: "",
        storyState: "Author",
      },
      inputs: [
        { id: `port-${Math.random()}-Author` },
        { id: `port-${Math.random()}-Reader` },
      ],
      outputs: [
        { id: `port-${Math.random()}-Author` },
        { id: `port-${Math.random()}-Reader` },
      ],
    };

    addNode(nextNode);
  };

  return (
    <div
      style={{
        overflow: "auto",
        backgroundImage: `url(${bg.src})`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="text-md w-screen h-screen"
    >
      <div
        className="absolute flex p-2 items-center justify-between gap-4 w-full backdrop-blur-sm"
        style={{ zIndex: "100" }}
      >
        <div className="flex justify-between gap-4">
          <input
            placeholder="Enter Story Title..."
            className="border h-8 px-1 text-md shadow-md"
            style={{ width: "400px" }}
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
          />
          {storyState === "Author" && (
            <>
              <button
                className="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 min-h-8 text-md shadow-md"
                onClick={() =>
                  addNewNode({ uniqueKey: `${Date.now()}_${Math.random()}` })
                }
              >
                📝 <span className="hidden lg:inline">Add Paragraph</span>
              </button>
              <button
                className="text-white bg-sky-800 px-3 py-1 rounded-sm hover:bg-purple-700 min-h-8 text-md shadow-md"
                onClick={() =>
                  save({
                    payload: {
                      storyData: schema,
                      storyId,
                      storyTitle,
                      bgIndex,
                    },
                  })
                }
              >
                💾<span className="hidden lg:inline">Save</span>
              </button>
            </>
          )}
          <button
            className="text-black bg-sky-100 px-3 py-1 rounded-sm hover:bg-purple-700 min-h-8 text-md shadow-md"
            type="button"
            onClick={() => setShowHelpModal(true)}
          >
            ❔<span className="hidden lg:inline">Help</span>
          </button>
        </div>

        <div className="flex gap-4">
          <select
            className="min-w-20 px-4"
            /*     value={storyState}
            onChange={(e) => {
              setStoryState(e.target.value);
            }} */
            placeholder="Story Theme"
          >
            <option value={""}>Story Theme</option>
            <option value={1}>Fantasy</option>
            <option value={2}>Sci-fi</option>
            <option value={3}>Crime</option>
            <option value={4}>Thriller</option>
            <option value={5}>Romance</option>
          </select>
          <select
            className="min-w-20 px-4"
            value={storyState}
            onChange={(e) => {
              setStoryState(e.target.value);

              if (schema?.nodes) {
                onChange(
                  uniqBy(schema.nodes, "id").map((el) => {
                    if (el?.data) {
                      el.data.storyState = e.target.value;
                      if (e.target.value !== "Reader") {
                        el.data.editMode = true;
                      } else {
                        el.data.editMode = false;
                      }
                    }
                    return { ...el };
                  })
                );
              }
            }}
          >
            <option>Author</option>
            <option>Reader</option>
          </select>
          <button
            className="text-white bg-gray-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md min-h-8 shadow-md"
            onClick={() =>
              save({
                payload: {
                  storyData: schema,
                  storyId,
                  storyTitle,
                  bgIndex,
                },
              })
            }
          >
            ▶️ <span className="hidden lg:inline">Read Path</span>
          </button>
          <button
            className="text-white bg-gray-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md min-h-8 shadow-md"
            onClick={() =>
              save({
                payload: {
                  storyData: schema,
                  storyId,
                  bgIndex,
                  storyTitle,
                },
                copyLink: true,
              })
            }
          >
            📄 <span className="hidden lg:inline">Publish</span>
          </button>
        </div>
      </div>

      <div
        style={{
          width: "calc(100vw * 3)",
          height: "calc(100vh * 3)",
          // overflow: "auto",
        }}
        title={`${schema?.nodes?.length}_${storyState}`}
      >
        <Diagram
          key={`${schema?.nodes?.length}_${storyState}`}
          schema={schema}
          onChange={(d) => {
            if (d?.schema?.nodes) {
              d.schema.nodes = uniqBy(d.schema.nodes, "id");
            }
            if (d.links) {
              d.links = d.links.map((link) => ({
                ...link,
                className: link?.output?.includes("Reader")
                  ? "reader-link-class"
                  : "",
              }));
            } else {
              // d.links = [];
            }

            console.log(d);
            onChange(d);
          }}
        />
      </div>

      {isLoading && (
        <div
          class="h-screen w-screen flex items-center justify-center fixed top-0 "
          style={{ zIndex: "200" }}
        >
          <div className="bg-white rounded border shadow-lg p-4">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        </div>
      )}

      <HelpModal showModal={showHelpModal} setShowModal={setShowHelpModal} />
    </div>
  );
};

export default function Home({ storyIdParam }) {
  return (
    <main className="">
      <UncontrolledDiagram storyIdParam={storyIdParam} />
    </main>
  );
}
