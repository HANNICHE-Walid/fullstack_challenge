import Link from "next/link";
import Head from "next/head";
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
let ptypeMap = {};
let attribMap = {};
let model = {};

export default function Page() {
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
      //const res1 = await API.post("/products", formValue);

      updateList();
      handleClose();
    } catch (err) {
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
    try {
      const res = await API.get("/product_types");
      setProductTypeList(res.data);
    } catch (err) {
      //console.log(err);
    }
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

      <Link href="/">
        <a>Back to home</a>
      </Link>

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
              try {
                const res1 = await API.delete("/product_types");

                updateList();
              } catch (err) {
                //console.log(err);
              }
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
        className="mx-4"
        //height={600}
        bordered
        data={data.map((p) => ({
          ...p,
          children: p.assignedAttributes.map((a) => ({
            ...a,
            _id: p._id + a._id,
          })),
        }))}
        isTree
        rowKey="_id"
      >
        <Column flexGrow={3} fixed>
          <HeaderCell>Name</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={1} align="center" fixed>
          <HeaderCell>Type</HeaderCell>
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
            {SelectedType &&
              ptypeMap[SelectedType].attributes.map((a) => {
                attribMap[a.name] = a._id;
                switch (a.type) {
                  case "DATE":
                    return (
                      <InputField
                        ref={formRef}
                        accepter={DatePicker}
                        name={a.name}
                        label={a.name + " :"}
                      />
                    );
                  case "BOOL":
                    return (
                      <InputField
                        ref={formRef}
                        accepter={Toggle}
                        name={a.name}
                        size="sm"
                        // value={formValue[a.name]}
                        // onChange={(v) => {
                        //   let fv = {...formValue};
                        //   fv[a.name] = v;
                        //   setFormValue(fv);
                        // }}
                        label={a.name + " :"}
                      />
                    );
                  case "STRING":
                    return (
                      <InputField
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
            //loading={loading}
          >
            Submit
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
