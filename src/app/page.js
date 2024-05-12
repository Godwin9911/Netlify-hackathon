"use client";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Image from "next/image";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { useEffectOnce, useIsMobile, useLocalStorage } from "./hooks";
import { AudioRecorder } from "react-audio-voice-recorder";
import bg from "../../public/images/medieval_town__free_wallpaper_by_a2a5_dfokr2n.png";
import bgFantasy from "../../public/images/medieval_town__free_wallpaper_by_a2a5_dfokr2n.png";
import bgSciFi from "../../public/images/sci_fi_structures_2_by_dustycrosley_d8pmhlm.jpg";
import bgCrime from "../../public/images/crime_scene_by_visibl3_db8krnj-pre.jpg";
import bgThriller from "../../public/images/windmill___1__by_elleykhure_dhcbn6w-pre.jpg";
import bgRomance from "../../public/images/ash_forest___by_elleykhure_dhdsr3e-pre.jpg";

import { toast } from "react-toastify";
import { cloneDeep, isEmpty, uniqBy } from "lodash";
import { ColorRing } from "react-loader-spinner";
import { copyText, imagePreloader, waitFor } from "./helpers";
import HelpModal from "./modals/HelpModal";
import SampleStoriesModal from "./modals/SampleStoriesModal";
import { HexColorPicker } from "react-colorful";
import SummaryModal from "./modals/SummaryModal";
import { arti } from "./font";

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
  const bgImages = [bg, bgFantasy, bgSciFi, bgCrime, bgThriller, bgRomance];
  const initialSchema = createSchema({
    nodes: [
      {
        id: "node-1",
        content: "🟢 Start Here !",
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
  const [bgIndex, setBgIndex] = useState(0);
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const [showSampleStoryModal, setShowSampleStoryModal] = React.useState(false);
  const [showSummaryModal, setShowSummaryModal] = React.useState(false);
  const [time, setTime] = useState(Date.now());
  const schemaRef = useRef();

  useEffect(() => {
    schemaRef.current = schema;
    console.log("Ref", schemaRef);
  }, [cloneDeep(schema)]);

  const deleteNodeFromSchema = (id) => {
    try {
      console.log(id, schema.nodes);
      const nodeToRemove = schema.nodes.find((node) => node.id === id);
      console.log(nodeToRemove);
      if (nodeToRemove) removeNode(nodeToRemove);
    } catch (err) {
      console.log(err);
    }
  };

  const save = async ({ payload, copyLink }) => {
    try {
      navigator.clipboard.writeText(
        `${window.location.origin}/published/${payload.storyId}`
      );
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

      //   console.log(response);

      if (!response.ok) {
        toast.error("Unable to save story");
      } else {
        toast("Story saved");
        if (copyLink) {
          copyText({
            text: `${window.location.origin}/published/${payload.storyId}`,
            toast,
          });
          window.open(`${window.location.origin}/published/${payload.storyId}`);
        }
      }
    } catch (err) {
      toast.error(JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  const populateData = async ({
    storyFound,
    storyState = "Reader",
    editMode = false,
  }) => {
    if (isEmpty(storyFound)) {
      return;
    }
    console.log(storyFound, "kk");
    setStoryId(storyFound.storyId);
    setBgIndex(storyFound?.bgIndex);
    setStoryTitle(storyFound.storyTitle);
    setStoryState(storyState);

    storyFound.storyData.nodes = storyFound.storyData.nodes.map((el) => {
      // console.log(el);
      return {
        ...el,
        ...(el.id !== "node-1"
          ? {
              render: CustomRender,
              data: {
                ...el.data,
                storyState,
                editMode,
                color: el.data?.color ? el.data?.color : "#DAE1E7",
              },
            }
          : {}),
      };
    });
    //  console.log(storyFound.storyData, "Reader");

    /*  console.log(
      storyFound.storyData.nodes.filter((el, index) => index !== 0)
    ); */

    // Reset
    if (schemaRef?.current?.nodes) {
      await schemaRef.current.nodes
        .filter((el, index) => index !== 0)
        .reduce(
          (p, node) =>
            new Promise(async (resolve) => {
              //  console.log(node);
              console.log("Remove", node.id);
              removeNode(node);
              await waitFor(100);
              return resolve();
            }),
          Promise.resolve()
        );
    }

    await storyFound.storyData.nodes
      .filter((el, index) => index !== 0)
      .reduce(
        (p, node) =>
          new Promise(async (resolve) => {
            //  console.log(node);
            addNode(node);
            await waitFor(100);
            return resolve();
          }),
        Promise.resolve()
      );

    await waitFor(1000);
    if (storyFound.storyData?.links)
      onChange({
        links: storyFound.storyData.links,
      });
  };

  const getStory = async ({
    storyIdParam,
    storyState = "Reader",
    editMode = false,
  }) => {
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

        populateData({
          storyFound,
          storyState,
          editMode,
        });
      }
    } catch (err) {
      toast.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffectOnce(() => {
    if (storyIdParam) {
      getStory({
        storyIdParam,
      });
    } else {
      getStory({
        storyIdParam: storyId,
        storyState: "Author",
        editMode: true,
      });
    }
  });

  const CustomRender = ({ id, content, data, inputs, outputs }) => {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const savefile = async ({ fileId, blob, dataKey = "blob" }) => {
      try {
        setIsLoading(true);
        const response = await fetch(`/.netlify/functions/savefile/${fileId}`, {
          method: "POST",
          body: blob,
        });

        if (!response.ok) {
          toast.error("Unable to save story");
        } else {
          toast("Saved");
          onChange(
            schema.nodes.map((el) => {
              if (el.id == id) {
                el.data[dataKey] = fileId;
              }
              return { ...el };
            })
          );
        }
      } catch (err) {
        toast.error(JSON.stringify(err));
      } finally {
        setIsLoading(false);
      }
    };

    const onFileSelected = async (event) => {
      const selectedFile = event.target?.files[0];
      if (!selectedFile) return;

      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = () => {
        const blob = new Blob([reader.result], {
          type: selectedFile.type,
        });

        savefile({
          fileId: `${Date.now()}_${parseInt(Math.random() * 10000)}`,
          blob,
        });
      };
    };

    const addAudioElement = (blob) => {
      savefile({
        fileId: `${Date.now()}_${parseInt(Math.random() * 10000)}`,
        blob,
        dataKey: "blobAudio",
      });
    };

    const setColor = (color) => {
      onChange(
        schema.nodes.map((el) => {
          if (el.id == id) {
            el.data.color = color;
          }
          return { ...el };
        })
      );
    };

    const [picker, setShowPicker] = useState(false);

    /* useEffect(() => {
      console.log(schemaRef.current, "sks");
    }, [schemaRef.current]); */

    const canShowText = useMemo(() => {
      if (!inputs) return false;
      const links = schemaRef.current.links?.filter(
        (link) =>
          link.input.includes("Reader") || link.output.includes("Reader")
      );

      const set = [
        ...inputs?.filter((port) => port?.key && port?.key?.includes("Reader")),
        ...outputs?.filter(
          (port) => port?.key && port?.key?.includes("Reader")
        ),
      ].find((port) => links.find((link) => link.input === port.key));

      return Boolean(set);
    }, [inputs, outputs, schemaRef.current?.links]);

    return (
      <div
        class="p-0 bg-white rounded-xl transform transition-all -hover:-translate-y-1 duration-300 shadow-lg hover:shadow-2xl relative pt-2"
        style={{
          width: "17rem",
          overflow: "hidden",
          borderTop: `6px Solid ${data?.color}`,
        }}
        /* onClick={(e) => {
          if (e.detail === 2) {
            const portId = e.target.getAttribute("data-port-id");

            
          }
        }} */
      >
        {/*   {`${canShowText}`} */}
        {data?.storyState === "Author" && (
          <div className="absolute right-0 top-0 flex item-center gap-2 p-1 text-xs items-center bg-white">
            <button
              onClick={() => setShowPicker(!picker)}
              title="Pick Color"
              className="w-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>palette</title>
                <path d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z" />
              </svg>{" "}
            </button>

            <div className="relative">
              {picker && (
                <div className="absolute w-40 z-10 right-0 top-4">
                  <HexColorPicker
                    className="w-40"
                    color={data.color}
                    onChange={setColor}
                  />
                </div>
              )}
            </div>

            {/*  {JSON.stringify(data.editMode)} */}

            <label htmlFor={`editMode_${id}`} title="Edit">
              <input
                type="checkbox"
                id={`editMode_${id}`}
                className="hidden"
                checked={data.editMode}
                onChange={(e) => {
                  console.log(e.target.checked);
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
              title="Delete"
              className=""
              //   title={id}
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
          {data?.blob ? (
            <div className="flex justify-center px-2">
              <img
                class="object-cover h-28 w-full"
                //  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                // src={data?.blob ? URL.createObjectURL(data.blob) : ""}
                src={`/.netlify/functions/getfile/${data?.blob}`}
                alt=""
              />
            </div>
          ) : null}

          {data.editMode && (
            <label
              htmlFor={`file_${id}`}
              className="mx-2 border rounded w-full p-1 text-sm bg-slate-50"
            >
              <input
                id={`file_${id}`}
                type="file"
                className="hidden"
                onChange={(e) => onFileSelected(e)}
              />
              + Add Image
            </label>
          )}

          <div class="p-2 pb-0 mb-0">
            {!data.editMode ? (
              <h2 class={`font-bold text-md mb-2 p-0 ${arti.className}`}>
                {data.title || "..."}
              </h2>
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
            {/*   {JSON.stringify(schema.links)} */}
            {!data.editMode ? (
              <p
                key={schema.links?.length}
                class={`text-xs text-gray-600 p-1 ${arti.className} ${
                  data.storyState === "Reader" && !canShowText ? "hidden" : ""
                }`}
              >
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

            <div className="mt-2">
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
                  src={`/.netlify/functions/getfile/${data?.blobAudio}`}
                  controls
                  className={`mt-2 w-full ${
                    data.storyState === "Reader" && !canShowText ? "hidden" : ""
                  }`}
                />
              )}{" "}
            </div>

            {data.editMode && (
              <div class="mt-2">
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

            {data?.title?.includes("Epilogue") && canShowText ? (
              <div class="mt-2">
                <button
                  role="button"
                  href="#"
                  class="text-white bg-gray-500  px-3 py-1 rounded-sm hover:bg-purple-700 text-xs"
                  onClick={() => setShowSummaryModal(true)}
                >
                  ▶️ <span className="hidden lg:inline">Read Path Summary</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl w-full">
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
                    background: "#075985",
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
                  onClick: () => forceUpdate(),
                  onMouseUp: async (e) => {
                    await waitFor(500);
                    forceUpdate();
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
                  onClick: () => forceUpdate(),
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
        color: "#DAE1E7",
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

    console.log(nextNode);

    addNode(nextNode);
  };

  const setBgImage = async ({ url, index }) => {
    try {
      setIsLoading(true);
      await imagePreloader(url);
      setBgIndex(Number(index));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        //  overflow: "auto",
        backgroundImage: `url('/.netlify/images?url=${bgImages[bgIndex]?.src}')`,
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="text-md w-screen nh-screen"
      key={bgIndex}
    >
      {/* {JSON.stringify(bgImages[bgIndex]?.src)} */}
      <div
        className="fixed top-0 left-0 flex flex-wrap lg:flex-nowrap p-2 items-center justify-between gap-4 w-full backdrop-blur-sm text-xs"
        style={{ zIndex: "100" }}
      >
        <div className="flex flex-wrap justify-start gap-4">
          <div className="w-8">
            <img src="/logo.svg" />
          </div>
          <input
            placeholder="Enter Story Title..."
            className="border h-8 px-1 text-md shadow-md"
            style={{ width: "400px", maxWidth: "50vw" }}
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
                title="Add a story branch"
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
                title="Save to Netlify"
              >
                💾<span className="hidden lg:inline">Save</span>
              </button>
            </>
          )}
          <button
            className="text-black bg-sky-100 px-3 py-1 rounded-sm hover:bg-purple-700 min-h-8 text-md shadow-md"
            type="button"
            onClick={() => setShowHelpModal(true)}
            title="Need Help ?"
          >
            ❔<span className="hidden lg:inline">Help</span>
          </button>
          <button
            className="text-black bg-sky-100 px-3 py-1 rounded-sm hover:bg-purple-700 min-h-8 text-md shadow-md"
            type="button"
            onClick={() => setShowSampleStoryModal(true)}
            title="Checkout a sample story"
          >
            🗣️ <span className="hidden lg:inline">Sample Stories</span>
          </button>
        </div>

        <div className="flex gap-4">
          <select
            className="min-w-20 px-4"
            value={bgIndex}
            onChange={(e) => {
              setBgImage({
                url: `/.netlify/images?url=${bgImages[e.target.value]?.src}`,
                index: e.target.value,
              });
            }}
            disabled={isLoading || (storyState === "Reader" && storyIdParam)}
            placeholder="Story Theme"
          >
            <option value={0}>Story Theme</option>
            <option value={1}>Fantasy</option>
            <option value={2}>Sci-fi</option>
            <option value={3}>Crime</option>
            <option value={4}>Thriller</option>
            <option value={5}>Romance</option>
          </select>
          <select
            className="min-w-20 px-4"
            disabled={isLoading || (storyState === "Reader" && storyIdParam)}
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

          {storyState === "Author" ? (
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
                  copyLink: true,
                })
              }
              title="Story will be saved and a link will be generated"
            >
              📄 <span className="hidden lg:inline">Publish</span>
            </button>
          ) : (
            <button
              className="text-white bg-gray-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md min-h-8 shadow-md"
              onClick={() => setShowSummaryModal(true)}
            >
              ▶️ <span className="hidden lg:inline">Read Path Summary</span>
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          width: "calc(100vw * 1)",
          height: "calc(100vh * 3)",
          overflow: "auto",
          display: "block",
        }}
        id={storyState}
        className="text-sm"

        // className="block"
        //   title={`${schema?.nodes?.length}_${storyState}`}
      >
        <Diagram
          key={`${schema?.nodes?.length}_${storyState}_${time}`}
          schema={schema}
          onChange={(d) => {
            console.log(d);
            if (d?.schema?.nodes) {
              d.schema.nodes = uniqBy(d.schema.nodes, "id");
            }
            if (d.links) {
              d.links = d.links.map((link) => ({
                ...link,
                ...(link?.output?.includes("Reader")
                  ? { className: "reader-link-class" }
                  : {}),
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

      {showHelpModal && (
        <HelpModal showModal={showHelpModal} setShowModal={setShowHelpModal} />
      )}
      {showSummaryModal && (
        <SummaryModal
          showModal={showSummaryModal}
          setShowModal={setShowSummaryModal}
          schema={schemaRef.current}
          storyTitle={storyTitle}
        />
      )}
      {showSampleStoryModal && (
        <SampleStoriesModal
          showModal={showSampleStoryModal}
          setShowModal={setShowSampleStoryModal}
          addNode={addNode}
          populateData={populateData}
        />
      )}
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
