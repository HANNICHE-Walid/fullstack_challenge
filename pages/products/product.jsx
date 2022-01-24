import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import API from "../../src/api";
import React from "react";
import { useEffect, useState } from "react";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import {
  Button,
  ButtonToolbar,
  Modal,
  Form,
  Schema,
  DatePicker,
  SelectPicker,
  Toggle,
  Pagination,
} from "rsuite";
import s from "../../styles/Navbar.module.css";

const { StringType, DateType, BooleanType } = Schema.Types;
const InputField = React.forwardRef((props, ref) => {
  const { name, label, accepter, ...rest } = props;
  return (
    <Form.Group controlId={`${name}-4`} ref={ref}>
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        className="px-2"
        name={name}
        accepter={accepter}
        {...rest}
        errorPlacement="bottomStart"
      />
    </Form.Group>
  );
});

InputField.displayName = "InputField";
let ptypeMap = {};
let attribMap = {};
let model = { name: StringType().isRequired("This field is required.") };

export default function Page() {
  const [DataLoading, setDataLoading] = useState(true);

  const formRef = React.useRef();
  const [formError, setFormError] = React.useState({});
  const [formValue, setFormValue] = React.useState({});

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    //console.log(attribMap)
    if (!formRef.current.check()) {
      console.error("Form Error", formError);
      return;
    }
    try {
      let assignedAttributes = [];
      setDataLoading(true);
      for (const v in formValue) {
        if (v != "name") {
          const res1 = await API.post("/assigned_attributes", {
            attribute: attribMap[v],
            attributeValue: formValue[v],
          });
          assignedAttributes.push(res1.data);
        }
      }

      await API.post("/products", {
        name: formValue["name"],
        productType: SelectedType,
        assignedAttributes,
      });
      updateList();
      setDataLoading(false);
      handleClose();
    } catch (err) {
      setDataLoading(false);
      //console.error(err);
    }
  };
  // console.log("fv", formValue);

  const [ProductList, setProductList] = useState([]);
  const [ProductTypeList, setProductTypeList] = useState([]);
  const [SelectedType, setSelectedType] = useState(null);
  for (const p of ProductTypeList) {
    ptypeMap[p._id] = p;
  }

  useEffect(() => {
    setFormValue({});
    attribMap = {};
    model = { name: StringType().isRequired("This field is required.") };
    setTimeout(() => {
      if (SelectedType) {
        for (const a of ptypeMap[SelectedType].attributes) {
          switch (a.type) {
            case "DATE":
              model[a.name] = DateType().isRequired("This field is required.");
              break;
            case "BOOL":
              let fv = { ...formValue };
              if (fv[a.name] === undefined) {
                setFormValue((fv) => {
                  fv[a.name] = false;
                  return fv;
                });
              }
              model[a.name] = BooleanType();
              break;
            case "STRING":
              model[a.name] = StringType().isRequired(
                "This field is required."
              );
              break;

            default:
              break;
          }
        }
      }
    }, 200);
  }, [SelectedType]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = ProductList.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });

  const updateList = async () => {
    try {
      const res = await API.get("/products");
      console.log(res.data);
      setProductList(res.data);
    } catch (err) {
      //console.log(err);
    }
  };
  const updatePTypeList = async () => {
    setDataLoading(true);
    try {
      const res = await API.get("/product_types");
      setProductTypeList(res.data);
    } catch (err) {
      setDataLoading(false);
      //console.log(err);
    }
    setDataLoading(false);
  };
  useEffect(() => {
    updateList();
    updatePTypeList();
  }, []);

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>

      <div className={s.nav}>
        <div className="flex items-center flex-1">
          <Link href="/">
            <span className={s.logo + " py-2 mx-4 px-4"}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </Link>
        </div>
      </div>

      <h1>Products</h1>
      <ButtonToolbar className="mx-2">
        <Button color="green" appearance="primary" onClick={handleOpen}>
          Create Product
        </Button>
        <Button
          color="red"
          appearance="primary"
          onClick={() => {
            const dac = async () => {
              setDataLoading(true);
              try {
                const res1 = await API.delete("/products");
                updateList();
              } catch (err) {
                setDataLoading(false);
                //console.log(err);
              }
              setDataLoading(false);
            };
            dac();
          }}
        >
          delete all
        </Button>
      </ButtonToolbar>
      <br />
      <br />
      <Table
        autoHeight
        className="mx-4  bg-white"
        loading={DataLoading}
        cellBordered
        // height={500}
        bordered
        data={data.map((p) => ({
          ...p,
          children: p.assignedAttributes.map((a) => {
            let v = a.attributeValue;
            switch (a.attribute.type) {
              case "BOOL":
                v = v ? "True" : "False";
                break;
              case "DATE":
                v = new Date(v).toLocaleDateString();
                break;
              default:
                break;
            }
            return {
              ...a,
              name: a.attribute.name,
              value: v,
              //type:a.attribute.type
            };
          }),
        }))}
        isTree
        rowKey="_id"
        onRowClick={(data) => {
          console.log(data);
        }}
      >
        <Column flexGrow={2} fixed>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Type</HeaderCell>
          <Cell dataKey="productType.name" />
        </Column>

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Value</HeaderCell>
          <Cell dataKey="value" />
        </Column>
      </Table>

      <br />
      <div style={{ padding: 20 }} className="float-right">
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          size="xs"
          layout={["limit", "|", "pager", "skip"]}
          total={ProductTypeList.length}
          limitOptions={[5, 10, 20, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>

      <Modal open={open} size={"sm"} onClose={handleClose}>
        <Modal.Header>
          <Modal.Title className="text-xl text-cla-blue text-center font-semibold mb-4">
            Create Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Product Type:
          <SelectPicker
            data={ProductTypeList.map((p) => ({ value: p._id, label: p.name }))}
            searchable={true}
            block
            value={SelectedType}
            onChange={setSelectedType}
            className="py-2"
          />
          <Form
            layout="horizontal"
            fluid
            ref={formRef}
            onChange={setFormValue}
            onCheck={setFormError}
            formValue={formValue}
            model={Schema.Model(model)}
          >
            <InputField ref={formRef} name={"name"} label={"Product Name :"} />
            {SelectedType &&
              ptypeMap[SelectedType].attributes.map((a) => {
                attribMap[a.name] = a._id;
                switch (a.type) {
                  case "DATE":
                    return (
                      <InputField
                        key={a._id}
                        ref={formRef}
                        accepter={DatePicker}
                        name={a.name}
                        label={a.name + " :"}
                      />
                    );
                  case "BOOL":
                    return (
                      <InputField
                        key={a._id}
                        ref={formRef}
                        accepter={Toggle}
                        name={a.name}
                        size="sm"
                        label={a.name + " :"}
                      />
                    );
                  case "STRING":
                    return (
                      <InputField
                        key={a._id}
                        ref={formRef}
                        name={a.name}
                        label={a.name + " :"}
                      />
                    );

                  default:
                    break;
                }
              })}
          </Form>
          <Button
            className="my-2 mt-10"
            appearance="primary"
            onClick={handleSubmit}
            disabled={!SelectedType}
            loading={DataLoading}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
