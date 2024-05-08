"use client";
import React, { useState } from "react";
import Image from "next/image";
import Diagram, { createSchema, useSchema } from "beautiful-react-diagrams";
import { useLocalStorage } from "./hooks";

const UncontrolledDiagram = () => {
  const initialSchema = createSchema({
    nodes: [
      {
        id: "node-1",
        content: "Start...",
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
    const response = await fetch("/.netlify/functions/", {
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
    const [editMode, setEditMode] = useState(false);
    return (
      <div
        key={id}
        class="p-0 bg-white rounded-xl transform transition-all -hover:-translate-y-1 duration-300 shadow-lg hover:shadow-2xl relative"
      >
        <div className="absolute right-0 top-0 flex gap-2 p-1 text-xs">
          <button className="" onClick={() => setEditMode(!editMode)}>
            🖋️
          </button>
          <button
            className=""
            title={id}
            onClick={() => {
              // if (confirm("Delete Paragraph?")) {
              deleteNodeFromSchema(id);
              // }
            }}
          >
            ✖️
          </button>
        </div>
        <div className="p-2">
          {/*  <img
          class="h-40 object-cover rounded-xl"
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
          alt=""
        /> */}
          <div class="p-2 mb-4">
            {!editMode ? (
              <h2 class="font-bold text-md mb-2 ">Heading</h2>
            ) : (
              <input
                className="border rounded mb-2 font-bold  text-md p-1"
                placeholder="Enter Heading"
                style={{ width: "100%" }}
              />
            )}

            {/*  {content} */}
            {!editMode ? (
              <p class="text-xs text-gray-600">
                Simple Yet Beautiful Card Design with TaiwlindCss. Subscribe to
                our Youtube channel for more ...
              </p>
            ) : (
              <textarea
                className="border rounded text-xs w-100 p-1"
                rows={3}
                placeholder="Enter Paragraph"
                style={{ width: "100%" }}
              ></textarea>
            )}
          </div>

          {/*  <div class="m-2">
            <a
              role="button"
              href="#"
              class="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 text-xs"
            >
              Learn More
            </a>
          </div> */}
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
                background: "#e2e8f0",
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
        schema.nodes[schema.nodes.length - 1].coordinates[0] + 250,
        schema.nodes[schema.nodes.length - 1].coordinates[1],
      ],
      render: CustomRender,
      data: {},
      inputs: [{ id: `port-${Math.random()}` }],
      outputs: [{ id: `port-${Math.random()}` }],
    };

    addNode(nextNode);
  };

  return (
    <div
      style={{ height: "100vh", width: "100vw", overflow: "auto" }}
      className="text-md"
    >
      <div className="absolute z-10 flex px-2 items-center justify-center">
        <input
          placeholder="Enter Story Title..."
          className="border h-8 px-1 text-md"
          style={{ width: "400px" }}
        />
        <button
          className="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 m-4 text-md"
          onClick={() =>
            addNewNode({ uniqueKey: `${Date.now()}_${Math.random()}` })
          }
        >
          📝 Add Paragraph
        </button>

        <button
          className="text-white bg-sky-500 px-3 py-1 rounded-sm hover:bg-purple-700 m-4 text-md"
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

      <Diagram
        key={schema?.nodes?.length}
        schema={schema}
        onChange={onChange}
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
