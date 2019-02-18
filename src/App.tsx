import React, { Component, ChangeEvent } from 'react';
import './App.css';
import Table from '@material-ui/core/Table';
import { TableHead, TableRow, TableCell, Paper, TableBody, withStyles, Select, MenuItem, InputLabel, FormControl, TextField, Button } from '@material-ui/core';
import { ExplosiveRepository, ExplosiveData } from './explosiveRepo/explosiveRepo';
import { Optional } from 'java8script';

const styles: any = (theme: any) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    background: "red",
    fontSize: 50
  },
  tableHead: {
    background: "cyan",
    borderWidth: 5,
  },
  cell: {
    border: `1px solid`,
    padding: 5,
  },
  table: {
    maxWidth: 700,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

function createRow(props: any, un: string, techName: string, primaryClass: string, packingGroup: string, neq: number, numPacks: number, numItems: number, desc: string) {
  return (<TableRow>
    <TableCell classes={{ root: props.classes.cell }} >{un}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{techName}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{primaryClass}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{packingGroup}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{neq}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{numPacks}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{numItems}</TableCell>
    <TableCell classes={{ root: props.classes.cell }} >{desc}</TableCell>
  </TableRow>);
}

interface FullExplosiveData extends ExplosiveData {
  packs: number;
  items: number;
}

interface State {
  numberPacks: number;
  numberItems: number;
  description: string;
  explosives: FullExplosiveData[];
}

interface Props {
  classes: any
}

const defaultFormState = {
  numberPacks: 0,
  numberItems: 0,
  description: ""
}
class App extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultFormState,
      explosives: []
    };
  }

  private onChangeDescSelector = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ description: event.target.value })
  }

  private onChangePacks = (event: ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(event.target.value);
    this.setState({ numberPacks: num ? num : 0 })
  }

  private onChangeItems = (event: ChangeEvent<HTMLInputElement>) => {
    const num = Number.parseInt(event.target.value);
    this.setState({ numberItems: num ? num : 0 })
  }

  private onClickButton = () => {
    if (this.state.numberItems > 0 &&
      this.state.numberPacks > 0 &&
      this.state.description !== "") {
      const data: Optional<ExplosiveData> = ExplosiveRepository.getByDescription(this.state.description);
      data.ifPresent(ed => {
        const full: FullExplosiveData = { ...ed, packs: this.state.numberPacks, items: this.state.numberItems };
        this.setState({
          ...defaultFormState,
          explosives: [...this.state.explosives, full]
        })
      })
    }
  }


  render() {
    console.log(this.state);
    return (
      <div className="App">
        <header className="App-header">
          <div className="hidden-print">
            <FormControl className={this.props.classes.formControl}>
              <InputLabel htmlFor="'desc-simple">Description</InputLabel>
              <Select
                value={this.state.description}
                onChange={this.onChangeDescSelector}
                inputProps={{
                  name: 'Description',
                  id: 'desc-simple',
                }}
              >
                {ExplosiveRepository.getDescriptions()
                  .map(d => <MenuItem value={d}>{d}</MenuItem>)
                }
              </Select>
              <TextField
                id="standard-number"
                label="Number of Packs"
                value={this.state.numberPacks}
                onChange={this.onChangePacks}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
              <TextField
                id="standard-number2"
                label="Number of Items"
                value={this.state.numberItems}
                onChange={this.onChangeItems}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
              <Button onClick={this.onClickButton}>
                Add
          </Button>
            </FormControl>
          </div>
          <Paper>
            <Table classes={{ root: this.props.classes.table }}>
              <TableHead classes={{ root: this.props.classes.tableHead }}>
                <TableRow>
                  <TableCell classes={{ root: this.props.classes.cell }} >UN Number</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Technical Name</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Primary Class</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Packing Group</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Total Quantity NEQ (KG)</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Number of Packages</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Number of Items</TableCell>
                  <TableCell classes={{ root: this.props.classes.cell }} >Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.explosives.map(fe => createRow(this.props, fe.unNumber, fe.technicalName, fe.primaryClass, fe.packingGroup, fe.perItemWeight * fe.items, fe.packs, fe.items, fe.description))}
              </TableBody>
            </Table>
          </Paper>
        </header>
      </div >
    );
  }
}

export default withStyles(styles)(App);
