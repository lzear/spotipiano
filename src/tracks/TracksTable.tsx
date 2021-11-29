import React from 'react'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { TableRowSelection } from 'antd/lib/table/interface'
import { Track } from '../store'
import { useQueryParams } from '../utils/useQueryParams'
import { ProgressIndicator } from '../utils/ProgressIndicator'

const TracksTable = <T extends Track>({
  tracks,
  columns,
  rowSelection,
  loading,
}: {
  tracks: T[]
  columns: ColumnsType<T>
  rowSelection?: TableRowSelection<T>
  loading: boolean
}): React.ReactElement => {
  const [params, setParams] = useQueryParams<{
    page?: string
    pageSize?: string
  }>()

  return (
    <>
      <ProgressIndicator active={loading} />
      <Table<T>
        rowKey="id"
        size="small"
        showSorterTooltip={false}
        dataSource={tracks}
        columns={columns}
        pagination={{
          current: params?.page ? Number(params.page) : undefined,
          pageSize: params?.pageSize ? Number(params.pageSize) : undefined,
          onChange: (page, pageSize) =>
            setParams({
              page: page.toString(),
              pageSize: pageSize?.toString(),
            }),
        }}
        rowSelection={rowSelection}
      />
      {/*<style jsx>{`*/}
      {/*  .playlists {*/}
      {/*    display: flex;*/}
      {/*    flex-wrap: wrap;*/}
      {/*  }*/}
      {/*  // .search {*/}
      {/*  //   margin: 15px 0;*/}
      {/*  // }*/}
      {/*`}</style>*/}
    </>
  )
}

export default TracksTable
