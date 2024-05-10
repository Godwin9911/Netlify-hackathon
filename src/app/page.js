"use client";
import React, { useState } from "react";
import Image from "next/image";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { useLocalStorage } from "./hooks";
import { AudioRecorder } from "react-audio-voice-recorder";
import bg from "../../public/images/medieval_town__free_wallpaper_by_a2a5_dfokr2n.png";

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

const UncontrolledDiagram = () => {
  const initialSchema = createSchema({
    nodes: [
      {
        id: "node-1",
        content: "Start Adventure...",
        coordinates: [60, 60],
        outputs: [{ id: "port-1", alignment: "right" }],
      },
    ],
  });
  // create diagrams schema
  const [schema, { onChange, addNode, removeNode }] = useSchema(initialSchema);
  const [storyId, setStoryId] = useLocalStorage("storyId", `${Date.now()}`);

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

  const save = async ({ payload }) => {
    const response = await fetch("/netlify/functions/savestory", {
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
  };

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
      >
        <div className="absolute right-0 top-0 flex item-center gap-2 p-1 text-xs items-center bg-white">
          <div>
            <input
              type="checkbox"
              id={`selected_${id}`}
              checked={data.selected}
              onClick={(e) => {
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
          </div>

          <label for={`editMode_${id}`}>
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
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
          className="absolute bottom-0 rounded-xl"
        >
          {inputs?.map((port) =>
            React.cloneElement(port, {
              style: {
                width: "24px",
                height: "24px",
                background: "#e2e8f0",
                borderBottomLeftRadius: "inherit",
              },
            })
          )}
          {outputs?.map((port) =>
            React.cloneElement(port, {
              style: {
                width: "24px",
                height: "24px",
                background: "red",
                borderBottomRightRadius: "inherit",
              },
            })
          )}
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
      },
      inputs: [{ id: `port-${Math.random()}` }],
      outputs: [{ id: `port-${Math.random()}` }],
    };

    addNode(nextNode);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        backgroundImage: `url(${bg.src})`,
      }}
      className="text-md"
    >
      <div className="absolute z-10 flex p-2 items-center justify-between gap-4 w-full ">
        <div className="flex justify-between gap-4">
          <input
            placeholder="Enter Story Title..."
            className="border h-8 px-1 text-md shadow-md"
            style={{ width: "400px" }}
          />
          <button
            className="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md shadow-md"
            onClick={() =>
              addNewNode({ uniqueKey: `${Date.now()}_${Math.random()}` })
            }
          >
            📝 Add Paragraph
          </button>

          <button
            className="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md shadow-md"
            onClick={() =>
              save({
                payload: {
                  storyData: schema,
                  storyId,
                },
              })
            }
          >
            💾 Save
          </button>
        </div>

        <div className="flex gap-4">
          <button
            className="text-white bg-gray-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md h-8 shadow-md"
            onClick={() =>
              save({
                payload: {
                  storyData: schema,
                  storyId,
                },
              })
            }
          >
            ▶️ Read Selected
          </button>
          <button
            className="text-white bg-gray-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-md h-8 shadow-md"
            onClick={() =>
              save({
                payload: {
                  storyData: schema,
                  storyId,
                },
              })
            }
          >
            📄 Publish
          </button>
        </div>
      </div>

      <Diagram
        key={schema?.nodes?.length}
        schema={schema}
        onChange={(d) => {
          //  console.log(d);
          onChange(d);
        }}
      />
    </div>
  );
};

export default function Home() {
  return (
    <main className="">
      <UncontrolledDiagram />
    </main>
  );
}
